import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/datasources/repositories/tb-user.repository';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { NaverLoginDto } from './dto/naver-login';
import { User, Provider } from 'src/datasources/entities/tb-user.entity';
import { v4 as uuidv4 } from 'uuid';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { WinstonLogger } from 'nest-winston';
import { logExternalApiError } from 'src/common/utils/external-api-error.util';

interface NaverTokenResponse {
  access_token?: string;
  refresh_token: string;
  token_type: string;
  expires_in: string;
  error?: string;
  error_description?: string;
}

interface NaverProfileResponse {
  resultcode: string;
  message: string;
  response: {
    id: string;
    nickname: string;
  };
}

interface JwtPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  private readonly redisClient: Redis;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      password: this.configService.get('REDIS_PASSWORD'),
    });
  }

  async loginWithNaver(dto: NaverLoginDto) {
    const tokenUrl = 'https://nid.naver.com/oauth2.0/token';
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.configService.get<string>('NAVER_CLIENT_ID') ?? '',
      client_secret:
        this.configService.get<string>('NAVER_CLIENT_SECRET') ?? '',
      code: dto.code,
      state: dto.state ?? '',
    }).toString();

    const tokenResponse = await fetch(`${tokenUrl}?${tokenParams}`);
    const tokenData = (await tokenResponse.json()) as NaverTokenResponse;
    if (!tokenResponse.ok || tokenData.error) {
      logExternalApiError(
        this.logger,
        'NAVER',
        '[Naver Token Error]',
        new Error(tokenData.error_description || 'Unknown OAuth Error'),
        {
          endpoint: 'token',
          status: tokenResponse.status,
          errorCode: tokenData.error,
        },
      );
      throw new BusinessException(ERROR_MESSAGES.NAVER_TOKEN_FAILED);
    }

    const accessToken = tokenData.access_token;
    if (!accessToken)
      throw new BusinessException(ERROR_MESSAGES.NAVER_TOKEN_FAILED);

    const profileUrl = 'https://openapi.naver.com/v1/nid/me';
    const profileResponse = await fetch(profileUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      throw new BusinessException(ERROR_MESSAGES.NAVER_PROFILE_FAILED);
    }

    const profileJson = (await profileResponse.json()) as NaverProfileResponse;
    const userData = profileJson.response;

    const username = userData.nickname;
    const providerId = userData.id;

    let user = await this.userRepository.findByProvider(
      Provider.NAVER,
      providerId,
    );

    if (!user) {
      user = new User();
      user.username = username;
      user.provider = Provider.NAVER;
      user.providerId = providerId;
      user.uuid = uuidv4();
      user.createdBy = 0;
      user = await this.userRepository.createUser(user);
    }

    const tokens = await this.issueTokens(user.uuid);

    return {
      ...tokens,
      user: {
        uuid: user.uuid,
        username: user.username,
      },
    };
  }

  // uuid로 사용자 조회
  async findUserByUuid(uuid: string): Promise<User | null> {
    return await this.userRepository.findByUuid(uuid);
  }

  async createGuestUser(): Promise<User> {
    const guestUuid = uuidv4();
    const guestUser = new User();
    guestUser.uuid = guestUuid;
    guestUser.username = `guest_${guestUuid.substring(0, 8)}`;
    guestUser.provider = Provider.GUEST;
    guestUser.createdBy = 0;
    return await this.userRepository.createUser(guestUser);
  }

  async refresh(refreshToken: string) {
    let payload: JwtPayload;
    // JWT 서명 검증
    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken);
    } catch {
      throw new BusinessException(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
    }

    const uuid = payload.sub;

    // Redis 조회
    let redisRt: string | null;
    try {
      redisRt = await this.redisClient.get(`RT:${uuid}`);
    } catch {
      throw new BusinessException(ERROR_MESSAGES.SERVICE_UNAVAILABLE);
    }

    // 토큰 비교
    if (!redisRt || redisRt !== refreshToken) {
      throw new BusinessException(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
    }

    // 새 토큰 발급
    return this.issueTokens(uuid);
  }

  // 토큰 발급 및 Redis 저장
  private async issueTokens(uuid: string) {
    const payload: JwtPayload = { sub: uuid };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    try {
      await this.redisClient.set(
        `RT:${uuid}`,
        refreshToken,
        'EX',
        60 * 60 * 24 * 7,
      );
    } catch {
      throw new BusinessException(ERROR_MESSAGES.TOKEN_UPDATE_FAILED);
    }
    return { accessToken, refreshToken };
  }

  // refreshToken의 JWT 서명 검증
  verifyRefreshToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new BusinessException(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
    }
  }

  // 로그아웃 메서드 추가
  async logout(uuid: string): Promise<void> {
    await this.redisClient.del(`RT:${uuid}`);
  }
}

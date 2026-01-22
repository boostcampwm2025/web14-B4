import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/datasources/repositories/tb-user.repository';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { NaverLoginDto } from './dto/naver-login';
import { User, Provider } from 'src/datasources/entities/tb-user.entity';
import { v4 as uuidv4 } from 'uuid';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';

interface NaverTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: string;
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
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
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
    if (!tokenResponse.ok) {
      const errorData = (await tokenResponse.json()) as Record<string, unknown>;
      console.error('Naver Token Error:', JSON.stringify(errorData));
      // TODO logExternalApiError로 교체 예정
      throw new BusinessException(ERROR_MESSAGES.NAVER_TOKEN_FAILED);
    }

    const tokenData = (await tokenResponse.json()) as NaverTokenResponse;
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

    const payload = { sub: user.uuid };
    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.redisClient.set(
      `RT:${user.uuid}`,
      newRefreshToken,
      'EX',
      60 * 60 * 24 * 7,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        uuid: user.uuid,
        username: user.username,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      const uuid = payload.sub;

      const redisRt = await this.redisClient.get(`RT:${uuid}`);

      if (!redisRt || redisRt !== refreshToken) {
        throw new BusinessException(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
      }

      const newPayload: JwtPayload = { sub: uuid };
      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: '1h',
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      await this.redisClient.set(
        `RT:${uuid}`,
        newRefreshToken,
        'EX',
        60 * 60 * 24 * 7,
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new BusinessException(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
    }
  }
}

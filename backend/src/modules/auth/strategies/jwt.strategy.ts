import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/datasources/repositories/tb-user.repository';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { BusinessException } from 'src/common/exceptions/business.exception';

interface JwtPayload {
  sub: string; // uuid
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      // 헤더의 Bearer Token에서 JWT를 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 만료된 토큰은 자동으로 401 에러 거부
      ignoreExpiration: false,
      // 토큰 서명 검증용 비밀키
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'no-secret',
    });
  }

  // 토큰 서명이 유효하면 실행
  async validate(payload: JwtPayload) {
    // payload의 sub로 DB에서 유저 찾기
    const user = await this.userRepository.findByUuid(payload.sub);

    if (!user) {
      // 유효한 토큰이지만, DB에 해당 유저가 없는 경우
      throw new BusinessException(ERROR_MESSAGES.ACCESS_DENIED);
    }

    return user;
  }
}

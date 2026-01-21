import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/datasources/repositories/tb-user.repository';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { NaverLoginDto } from './dto/naver-login';

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

  async loginWithNaver(_dto: NaverLoginDto) {
    // OAuth 로직은 다음 커밋에서 구현 예정
    await Promise.resolve();
  }
}

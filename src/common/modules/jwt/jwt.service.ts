/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces/jwt-token.interface';
import { TokenResult } from 'src/common/interfaces/token-result.interface';
import { IJwtTokenService } from '../../interfaces/token-service.interface';

@Injectable()
export class JwtTokenService implements IJwtTokenService {
  constructor(private readonly jwtService: JwtService) {}
  generateAccessToekn(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
  generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  verifyToknen(token: string): TokenResult {
    try {
      const payload = this.jwtService.verify(token);
      return {
        isValud: true,
        payload,
      };
    } catch (e) {
      return {
        isValud: false,
        payload: null,
        error: '유효한 토큰이 아닙니다.',
      };
    }
  }
}

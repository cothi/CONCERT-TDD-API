import { JwtPayload } from './jwt-token.interface';
import { TokenResult } from './token-result.interface';

export interface IJwtTokenService {
  generateAccessToken(payload: JwtPayload): string;
  generateRefreshToken(payload: JwtPayload): string;
  verifyToken(token: string): TokenResult;
}

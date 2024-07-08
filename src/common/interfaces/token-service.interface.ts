import { JwtPayload } from './jwt-token.interface';
import { TokenResult } from './token-result.interface';

export interface IJwtTokenService {
  generateAccessToekn(payload: JwtPayload): string;
  generateRefreshToken(payload: JwtPayload): string;
  verifyToknen(token: string): TokenResult;
}

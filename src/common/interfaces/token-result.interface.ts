import { JwtPayload } from './jwt-token.interface';

export interface TokenResult {
  isValid: boolean;
  payload: JwtPayload | null;
  error?: string;
}

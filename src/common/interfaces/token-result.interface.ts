import { JwtPayload } from './jwt-token.interface';

export interface TokenResult {
  isValud: boolean;
  payload: JwtPayload | null;
  error?: string;
}

import { IsString } from 'class-validator';

export class TokenRefreshDto {
  @IsString()
  refreshToken: string;
}

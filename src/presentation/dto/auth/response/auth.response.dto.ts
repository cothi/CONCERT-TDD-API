import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';

export class AuthResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  @Optional()
  refreshToken: string;
}

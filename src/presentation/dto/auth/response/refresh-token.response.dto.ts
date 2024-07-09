import { PickType } from '@nestjs/swagger';
import { AuthResponseDto } from './auth.response.dto';

export class RefreshTokenResponseDto extends PickType(AuthResponseDto, ['accessToken']) {}

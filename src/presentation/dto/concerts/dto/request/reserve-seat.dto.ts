import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ReserveSeatDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '예약하는 사용자의 ID',
  })
  @IsUUID()
  userId: string;
}

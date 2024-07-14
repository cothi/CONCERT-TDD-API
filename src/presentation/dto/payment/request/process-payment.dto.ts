import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ProcessPaymentDto {
  @ApiProperty({
    description: '예약 ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  reservationId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class EnqueueDto {
  @ApiProperty({
    description: '대기열에 등록할 사용자의 고유 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;
}

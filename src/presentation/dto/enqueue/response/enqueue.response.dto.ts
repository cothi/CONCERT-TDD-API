import { ApiProperty } from '@nestjs/swagger';

export class EnqueueResponseDto {
  @ApiProperty({
    description: '대기열 현재 위치',
    example: '1',
  })
  position: number;
}

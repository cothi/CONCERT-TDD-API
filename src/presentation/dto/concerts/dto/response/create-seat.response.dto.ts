// src/modules/seat/dto/seat-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsUUID, IsOptional } from 'class-validator';

export class CreateSeatResponseDto {
  @ApiProperty({ description: '생성된 좌석의 수' })
  @IsNumber()
  createdSeatsCount: number;

  @ApiProperty({ description: '좌석 생성 작업의 성공 여부' })
  @IsBoolean()
  success: boolean;

  @ApiProperty({ description: '콘서트 날짜 ID' })
  @IsUUID()
  concertDateId: string;

  @ApiProperty({ description: '에러 메시지 (실패 시)', required: false })
  @IsOptional()
  errorMessage?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Concert } from '@prisma/client';

export class ConcertResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '콘서트 ID',
  })
  concertId: string;

  @ApiProperty({
    example: '2023 여름 록 페스티벌',
    description: '콘서트 이름',
  })
  name: string;

  @ApiProperty({
    example: '2023-07-01T09:00:00.000Z',
    description: '콘서트 생성 일시',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-07-01T09:00:00.000Z',
    description: '콘서트 정보 마지막 수정 일시',
  })
  updatedAt: Date;
  static fromConcert(model: Concert) {
    const dto = new ConcertResponseDto();
    dto.concertId = model.id;
    dto.name = model.name;
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;

    return dto;
  }
}

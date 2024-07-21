import { ApiProperty } from '@nestjs/swagger';
import { Concert } from '@prisma/client';

export class GetConcertsResponseDto {
  @ApiProperty({
    description: '콘서트 목록',
  })
  concerts: Concert[];

  static fromConcerts(concerts: Concert[]) {
    const dto = new GetConcertsResponseDto();
    dto.concerts = concerts;

    return dto;
  }
}

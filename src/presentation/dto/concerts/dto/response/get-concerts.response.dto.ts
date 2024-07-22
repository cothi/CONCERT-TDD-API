import { ApiProperty } from '@nestjs/swagger';
import { ConcertModel } from 'src/domain/concerts/model/concert.model';

export class GetConcertsResponseDto {
  @ApiProperty({
    description: '콘서트 목록',
  })
  concerts: ConcertModel[];

  static fromConcerts(concerts: ConcertModel[]) {
    const dto = new GetConcertsResponseDto();
    dto.concerts = concerts;

    return dto;
  }
}

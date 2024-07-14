import { GCDByConcertIdModel } from 'src/domain/concerts/model/concert-date.model';
import { ConcertDateResponseDto } from 'src/presentation/dto/concerts/dto/response/concert-date.response.dto';
import { Injectable } from '@nestjs/common';
import { ConcertDateService } from 'src/domain/concerts/services/concert-date.service';

@Injectable()
export class GetConcertDatesUseCase {
  constructor(private readonly concertDateService: ConcertDateService) {}
  async execute(concertId: string): Promise<ConcertDateResponseDto[]> {
    const gcdByConcertIdModel: GCDByConcertIdModel = {
      concertId: concertId,
    };
    const concertDates =
      await this.concertDateService.getConcertDateByConcertId(
        gcdByConcertIdModel,
      );

    return ConcertDateResponseDto.fromConcertDates(concertDates);
  }
}

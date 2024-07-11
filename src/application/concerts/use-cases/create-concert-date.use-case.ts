import { Injectable } from '@nestjs/common';
import { ConcertDateResponseDto } from 'src/presentation/dto/concerts/dto/response/concert-date.response.dto';
import { IUseCase } from '../../auth/interfaces/use-case.interface';
import { CreateConcertDateCommand } from '../command/create-concert-data.command';
import { ConcertDateService } from 'src/domain/concerts/services/concert-date.service';
@Injectable()
export class CreateConcertDateUseCase
  implements IUseCase<CreateConcertDateCommand, ConcertDateResponseDto>
{
  constructor(private readonly concertDateSerivce: ConcertDateService) {}

  async execute(
    input: CreateConcertDateCommand,
  ): Promise<ConcertDateResponseDto> {
    const concert = await this.concertDateSerivce.createConcertDate({
      concertId: input.concertId,
      date: input.date,
      totalSeat: input.totalSeat,
    });
    const response = new ConcertDateResponseDto();
    response.availableSeatCount = concert.availableSeatCount;
    response.concertId = concert.concertId;
    response.date = concert.date;
    response.concertDateId = concert.id;
    response.totalSeat = concert.totalSeat;

    return response;
  }
}

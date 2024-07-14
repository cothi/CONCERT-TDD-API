import { Injectable } from '@nestjs/common';
import { CreateConcertDateModel } from 'src/domain/concerts/model/concert-date.model';
import { ConcertDateService } from 'src/domain/concerts/services/concert-date.service';
import { ConcertDateResponseDto } from 'src/presentation/dto/concerts/dto/response/concert-date.response.dto';
import { IUseCase } from '../../auth/interfaces/use-case.interface';
import { CreateConcertDateCommand } from '../command/create-concert-data.command';
@Injectable()
export class CreateConcertDateUseCase
  implements IUseCase<CreateConcertDateCommand, ConcertDateResponseDto>
{
  constructor(private readonly concertDateService: ConcertDateService) {}

  async execute(
    input: CreateConcertDateCommand,
  ): Promise<ConcertDateResponseDto> {
    const model: CreateConcertDateModel = {
      concertId: input.concertId,
      date: input.date,
      totalSeat: input.totalSeat,
    };
    const concertDate = await this.concertDateService.createConcertDate(model);
    return ConcertDateResponseDto.fromConcertDate(concertDate);
  }
}

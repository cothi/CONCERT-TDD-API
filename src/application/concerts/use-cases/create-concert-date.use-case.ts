import { Injectable } from '@nestjs/common';
import { CreateConcertDateModel } from 'src/domain/concerts/model/concert-date.model';
import { ConcertDateService } from 'src/domain/concerts/services/concert-date.service';
import { ConcertDateResponseDto } from 'src/presentation/dto/concerts/dto/response/concert-date.response.dto';
import { IUseCase } from '../../../common/interfaces/use-case.interface';
import { CreateConcertDateCommand } from '../command/create-concert-data.command';
import { ConcertService } from 'src/domain/concerts/services/concert.service';
import { FindConcertByIdModel } from 'src/domain/concerts/model/concert.model';
@Injectable()
export class CreateConcertDateUseCase
  implements IUseCase<CreateConcertDateCommand, ConcertDateResponseDto>
{
  constructor(
    private readonly concertDateService: ConcertDateService,
    private readonly concertService: ConcertService,
  ) {}

  async execute(
    cmd: CreateConcertDateCommand,
  ): Promise<ConcertDateResponseDto> {
    try {
      const findModel = FindConcertByIdModel.create(cmd.concertId);
      const concert = await this.concertService.getConcertById(findModel);

      const createConcertDateModel = CreateConcertDateModel.create(
        concert.concertId,
        cmd.date,
        cmd.totalSeat,
      );
      const concertDate = await this.concertDateService.createConcertDate(
        createConcertDateModel,
      );
      return ConcertDateResponseDto.fromConcertDate(concertDate);
    } catch (error) {
      throw error;
    }
  }
}

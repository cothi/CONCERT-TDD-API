import { GCDByConcertIdModel } from 'src/domain/concerts/model/concert-date.model';
import { ConcertDateResponseDto } from 'src/presentation/dto/concerts/dto/response/concert-date.response.dto';
import { Injectable } from '@nestjs/common';
import { ConcertDateService } from 'src/domain/concerts/services/concert-date.service';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { GetConcertByConcertIdCommand } from '../command/get-concert-by-concertid.command';

@Injectable()
export class GetConcertDatesUseCase
  implements IUseCase<GetConcertByConcertIdCommand, ConcertDateResponseDto[]>
{
  constructor(private readonly concertDateService: ConcertDateService) {}
  async execute(
    cmd: GetConcertByConcertIdCommand,
  ): Promise<ConcertDateResponseDto[]> {
    try {
      const gcdByConcertIdModel = GCDByConcertIdModel.create(cmd.concertId);
      const concertDates =
        await this.concertDateService.getConcertDateByConcertId(
          gcdByConcertIdModel,
        );
      return ConcertDateResponseDto.fromConcertDates(concertDates);
    } catch (error) {
      throw error;
    }
  }
}

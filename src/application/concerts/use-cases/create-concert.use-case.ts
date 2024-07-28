import { Injectable } from '@nestjs/common';
import { ConcertService } from '../../../domain/concerts/services/concert.service';
import { ConcertResponseDto } from '../../../presentation/dto/concerts/dto/response/concert.response.dto';
import { IUseCase } from '../../../common/interfaces/use-case.interface';
import { CreateConcertCommand } from '../command/create-concert.command';
import { CreateConcertModel } from 'src/domain/concerts/model/concert.model';
@Injectable()
export class CreateConcertUseCase
  implements IUseCase<CreateConcertCommand, ConcertResponseDto>
{
  constructor(private readonly concertService: ConcertService) {}

  async execute(cmd: CreateConcertCommand): Promise<ConcertResponseDto> {
    try {
      const createConcertModel = CreateConcertModel.create(cmd.name);
      const concert =
        await this.concertService.createConcert(createConcertModel);
      return ConcertResponseDto.fromConcert(concert);
    } catch (error) {
      throw error;
    }
  }
}

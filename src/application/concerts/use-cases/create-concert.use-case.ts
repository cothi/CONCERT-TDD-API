import { IUseCase } from '../../auth/interfaces/use-case.interface';
import { ConcertResponseDto } from '../../../presentation/dto/concerts/dto/response/concert.response.dto';
import { CreateConcertCommand } from '../dto/create-concert.command';
import { ConcertService } from '../../../domain/concerts/services/concert.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class CreateConcertUseCase
  implements IUseCase<CreateConcertCommand, ConcertResponseDto>
{
  constructor(private readonly concertService: ConcertService) {}

  async execute(input: CreateConcertCommand): Promise<ConcertResponseDto> {
    const concert = await this.concertService.createConcert({
      name: input.name,
    });
    const response = new ConcertResponseDto();
    response.createdAt = concert.createdAt;
    response.updatedAt = concert.updatedAt;
    response.name = concert.name;
    response.concertId = concert.id;

    return response;
  }
}

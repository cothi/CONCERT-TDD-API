import { Injectable } from '@nestjs/common';
import { ConcertService } from 'src/domain/concerts/services/concert.service';
import { GetConcertsResponseDto } from './../../../presentation/dto/concerts/dto/response/get-concerts.response.dto';
import { IUseCase } from 'src/common/interfaces/use-case.interface';

@Injectable()
export class GetConcertsUseCase
  implements IUseCase<null, GetConcertsResponseDto>
{
  constructor(private readonly concertService: ConcertService) {}

  async execute(): Promise<GetConcertsResponseDto> {
    try {
      const concerts = await this.concertService.getAllConcerts();
      return GetConcertsResponseDto.fromConcerts(concerts);
    } catch (error) {
      throw error;
    }
  }
}

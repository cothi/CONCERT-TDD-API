import { Injectable } from '@nestjs/common';
import { ConcertService } from 'src/domain/concerts/services/concert.service';
import { GetConcertsResponseDto } from './../../../presentation/dto/concerts/dto/response/get-concerts.response.dto';

@Injectable()
export class GetConcertsUseCase {
  constructor(private readonly concertService: ConcertService) {}

  async execute(): Promise<GetConcertsResponseDto> {
    const concerts = await this.concertService.getAllConcerts();
    return GetConcertsResponseDto.fromConcerts(concerts);
  }
}

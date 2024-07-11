import { Injectable } from '@nestjs/common';
import { CreateConcertDateModel } from '../model/concert-date.model';
import { ConcertDateRepository } from 'src/infrastructure/database/repositories/concerts/concert-date.repository';

@Injectable()
export class ConcertDateService {
  constructor(private readonly concertDateRepository: ConcertDateRepository) {}

  async createConcertDate(createConcertDateModel: CreateConcertDateModel) {
    return await this.concertDateRepository.create(createConcertDateModel);
  }

  async getConcertDateByConcertId(concertId: string) {}

  async getConcertDateByConcertDateId(concertDateId: string) {}
}

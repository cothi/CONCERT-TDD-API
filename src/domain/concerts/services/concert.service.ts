import { Injectable } from '@nestjs/common';
import { Concert } from '@prisma/client';
import { ConcertRepository } from 'src/infrastructure/database/repositories/concerts/concert.repository';
import { CreateConcertModel, FindConcertModel } from '../model/concert.model';

@Injectable()
export class ConcertService {
  constructor(private readonly concertRepository: ConcertRepository) {}

  async createConcert(
    createConcertModel: CreateConcertModel,
  ): Promise<Concert> {
    return this.concertRepository.create({
      name: createConcertModel.name,
    });
  }

  async getConcertById(
    findConcertModel: FindConcertModel,
  ): Promise<Concert | null> {
    return this.concertRepository.findById(findConcertModel.concertId);
  }

  async getAllConcerts(): Promise<Concert[]> {
    return this.concertRepository.findAllConcert();
  }
}

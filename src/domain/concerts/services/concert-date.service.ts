import { Injectable } from '@nestjs/common';
import { CreateConcertDateModel } from '../model/concert-date.model';
import { ConcertDateRepository } from 'src/infrastructure/database/repositories/concerts/concert-date.repository';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';

@Injectable()
export class ConcertDateService {
  constructor(private readonly concertDateRepository: ConcertDateRepository) {}

  async createConcertDate(
    createConcertDateModel: CreateConcertDateModel,
    tx?: PrismaTransaction,
  ) {
    return await this.concertDateRepository.create(createConcertDateModel);
  }
  async getConcertDateByConcertId(concertId: string, tx?: PrismaTransaction) {
    return await this.concertDateRepository.findByConcertId(concertId, tx);
  }
  async getConcertDateByConcertDateId(
    concertDateId: string,
    tx?: PrismaTransaction,
  ) {
    return await this.concertDateRepository.findById(concertDateId, tx);
  }
}

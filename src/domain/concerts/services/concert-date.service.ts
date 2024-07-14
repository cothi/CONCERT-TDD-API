import { Injectable } from '@nestjs/common';
import { ConcertDateRepository } from 'src/infrastructure/database/repositories/concerts/concert-date.repository';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import { CreateConcertDateModel } from '../model/concert-date.model';
import {
  GCDByConcertDateIdModel,
  GCDByConcertIdModel,
} from './../model/concert-date.model';

@Injectable()
export class ConcertDateService {
  constructor(private readonly concertDateRepository: ConcertDateRepository) {}

  async createConcertDate(
    createConcertDateModel: CreateConcertDateModel,
    tx?: PrismaTransaction,
  ) {
    return await this.concertDateRepository.create(createConcertDateModel, tx);
  }
  async getConcertDateByConcertId(
    gcdByConcertIdModel: GCDByConcertIdModel,
    tx?: PrismaTransaction,
  ) {
    return await this.concertDateRepository.findByConcertId(
      gcdByConcertIdModel,
      tx,
    );
  }
  async getConcertDateByConcertDateId(
    gcdByConcertDateIdModel: GCDByConcertDateIdModel,
    tx?: PrismaTransaction,
  ) {
    return await this.concertDateRepository.findById(
      gcdByConcertDateIdModel,
      tx,
    );
  }
}

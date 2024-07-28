import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { ErrorFactory } from 'src/common/errors/error-factory.error';
import { ConcertDateRepository } from 'src/infrastructure/concerts/repositories/concert-date.repository';
import { PrismaTransaction } from 'src/infrastructure/database/prisma/types/prisma.types';
import {
  ConcertDateModel,
  CreateConcertDateModel,
} from '../model/concert-date.model';
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
  ): Promise<ConcertDateModel> {
    const concertDate = await this.concertDateRepository.findByDate(
      createConcertDateModel,
    );
    if (concertDate) {
      throw ErrorFactory.createException(ErrorCode.CONCERT_DATE_SAME_EXIST);
    }
    return await this.concertDateRepository.create(createConcertDateModel, tx);
  }
  async getConcertDateByConcertId(
    gcdByConcertIdModel: GCDByConcertIdModel,
    tx?: PrismaTransaction,
  ) {
    const concertDate = await this.concertDateRepository.findByConcertId(
      gcdByConcertIdModel,
      tx,
    );
    if (!concertDate) {
      throw ErrorFactory.createException(ErrorCode.CONCERT_DATE_NOT_FOUNT);
    }
    return concertDate;
  }
  async getConcertDateByConcertDateId(
    gcdByConcertDateIdModel: GCDByConcertDateIdModel,
    tx?: PrismaTransaction,
  ) {
    const concertDate = await this.concertDateRepository.findById(
      gcdByConcertDateIdModel,
      tx,
    );
    if (!concertDate) {
      throw ErrorFactory.createException(ErrorCode.CONCERT_DATE_NOT_FOUNT);
    }
    return concertDate;
  }
}

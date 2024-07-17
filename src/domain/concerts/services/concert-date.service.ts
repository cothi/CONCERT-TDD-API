import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const concertDate = await this.concertDateRepository.findByDate(
      createConcertDateModel,
    );

    if (concertDate) {
      throw new HttpException(
        '이미 요청한 날짜에 콘서트가 생성이 되었습니다.',
        HttpStatus.CONFLICT,
      );
    }
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
    const concertDate = await this.concertDateRepository.findById(
      gcdByConcertDateIdModel,
      tx,
    );
    if (!concertDate) {
      throw new HttpException(
        '조회한 콘서트 날짜가 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return concertDate;
  }
}

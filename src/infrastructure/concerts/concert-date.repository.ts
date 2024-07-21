import { Injectable } from '@nestjs/common';
import { ConcertDate } from '@prisma/client';
import {
  CreateConcertDateModel,
  GCDByConcertDateIdModel,
  GCDByConcertIdModel,
} from 'src/domain/concerts/model/concert-date.model';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConcertDateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateConcertDateModel,
    tx?: PrismaTransaction,
  ): Promise<ConcertDate | null> {
    const concertDate = await (tx ?? this.prisma).concertDate.create({
      data: {
        concertId: data.concertId,
        date: data.date,
        totalSeat: data.totalSeat,
        availableSeatCount: data.totalSeat,
      },
    });

    return concertDate;
  }

  async findById(
    gcdByConcertIdModel: GCDByConcertDateIdModel,
    tx?: PrismaTransaction,
  ): Promise<ConcertDate | null> {
    return await (tx ?? this.prisma).concertDate.findUnique({
      where: {
        id: gcdByConcertIdModel.concertDateId,
      },
    });
  }

  async findByConcertId(
    gcdByConcertDateIdModel: GCDByConcertIdModel,
    tx?: PrismaTransaction,
  ): Promise<ConcertDate[]> {
    return await (tx ?? this.prisma).concertDate.findMany({
      where: { concertId: gcdByConcertDateIdModel.concertId },
    });
  }

  async findByDate(
    createConcertDateModel: CreateConcertDateModel,
    tx?: PrismaTransaction,
  ): Promise<ConcertDate | null> {
    return await (tx ?? this.prisma).concertDate.findFirst({
      where: {
        date: createConcertDateModel.date,
        concertId: createConcertDateModel.concertId,
      },
    });
  }
}

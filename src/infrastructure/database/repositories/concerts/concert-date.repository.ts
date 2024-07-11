import { Injectable } from '@nestjs/common';
import { ConcertDate } from '@prisma/client';
import { CreateConcertDateModel } from 'src/domain/concerts/model/concert-date.model';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';

@Injectable()
export class ConcertDateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateConcertDateModel,
    tx?: PrismaTransaction,
  ): Promise<ConcertDate> {
    return await (tx ?? this.prisma).concertDate.create({
      data: {
        concertId: data.concertId,
        date: data.date,
        totalSeat: data.totalSeat,
        availableSeatCount: data.totalSeat,
      },
    });
  }

  async findById(
    dateId: string,
    tx?: PrismaTransaction,
  ): Promise<ConcertDate | null> {
    return await (tx ?? this.prisma).concertDate.findUnique({
      where: { id: dateId },
    });
  }

  async findByConcertId(
    concertId: string,
    tx?: PrismaTransaction,
  ): Promise<ConcertDate[]> {
    return await (tx ?? this.prisma).concertDate.findMany({
      where: { concertId },
    });
  }
}

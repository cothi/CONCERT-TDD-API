import { Injectable } from '@nestjs/common';
import { ConcertDate } from '@prisma/client';
import {
  ConcertDateModel,
  CreateConcertDateModel,
  GCDByConcertDateIdModel,
  GCDByConcertIdModel,
} from 'src/domain/concerts/model/concert-date.model';
import { PrismaTransaction } from 'src/infrastructure/database/prisma/types/prisma.types';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ConcertDateMapper } from '../mapper/concert-date.mapper';

@Injectable()
export class ConcertDateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    model: CreateConcertDateModel,
    tx?: PrismaTransaction,
  ): Promise<ConcertDateModel | null> {
    const entity = ConcertDateMapper.toMapCreateConcertEntity(model);
    const concertDate: ConcertDate = await (
      tx ?? this.prisma
    ).concertDate.create({
      data: {
        concertId: entity.concertId,
        date: entity.date,
        totalSeat: entity.totalSeat,
        availableSeatCount: entity.totalSeat,
      },
    });
    return ConcertDateMapper.toMapConcertDateModel(concertDate);
  }

  async findById(
    model: GCDByConcertDateIdModel,
    tx?: PrismaTransaction,
  ): Promise<ConcertDateModel | null> {
    const entity = ConcertDateMapper.toMapConcertByDateIdEntity(model);
    const concertDate = await (tx ?? this.prisma).concertDate.findUnique({
      where: {
        id: entity.concertDateId,
      },
    });

    return ConcertDateMapper.toMapConcertDateModel(concertDate);
  }

  async findByConcertId(
    model: GCDByConcertIdModel,
    tx?: PrismaTransaction,
  ): Promise<ConcertDateModel[]> {
    const entity = ConcertDateMapper.toMapConcertByConcertIdEntity(model);
    const concerts = await (tx ?? this.prisma).concertDate.findMany({
      where: { concertId: entity.concertId },
    });
    return ConcertDateMapper.toMapConcertDatesModel(concerts);
  }

  async findByDate(
    model: CreateConcertDateModel,
    tx?: PrismaTransaction,
  ): Promise<ConcertDateModel | null> {
    const entity = ConcertDateMapper.toMapConcertDateByDateEntity(model);
    const concertDate = await (tx ?? this.prisma).concertDate.findFirst({
      where: {
        date: entity.date,
        concertId: entity.concertId,
      },
    });
    return ConcertDateMapper.toMapConcertDateModel(concertDate);
  }
}

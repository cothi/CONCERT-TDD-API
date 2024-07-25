import { Injectable } from '@nestjs/common';
import { Prisma, Seat } from '@prisma/client';
import {
  CreateSeatModel,
  GetSeatByConcertDateIdModel,
  GetSeatBySeatIdModel,
  SeatModel,
  UpdateSeatStatusModel,
} from 'src/domain/concerts/model/seat.model';
import { PrismaTransaction } from 'src/infrastructure/database/prisma/types/prisma.types';
import { PrismaService } from '../../database/prisma/prisma.service';
import { SeatMapper } from '../mapper/seat.mapper';

@Injectable()
export class SeatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(
    model: CreateSeatModel[],
    tx?: PrismaTransaction,
  ): Promise<Prisma.BatchPayload> {
    const entities = SeatMapper.toMapCreateSeatsEntity(model);
    const seats = await (tx ?? this.prisma).seat.createMany({
      data: entities,
    });
    return seats;
  }

  async findBySeatId(
    model: GetSeatBySeatIdModel,
    tx?: PrismaTransaction,
  ): Promise<SeatModel | null> {
    const entity = SeatMapper.toMapGetSeatByIdEntity(model);
    const seat = await (tx ?? this.prisma).seat.findUnique({
      where: { id: entity.id },
    });
    return SeatMapper.toMapSeatModel(seat);
  }

  async findAndLockById(
    model: GetSeatBySeatIdModel,
    tx?: PrismaTransaction,
  ): Promise<SeatModel | null> {
    const entity = SeatMapper.toMapGetSeatByIdEntity(model);
    const [seat] = await (tx ?? this.prisma).$queryRaw<Seat[]>`
    SELECT * FROM "Seat" WHERE id = ${entity.id} FOR UPDATE NOWAIT`;
    return SeatMapper.toMapSeatModel(seat);
  }

  async findByConcertDateId(
    model: GetSeatByConcertDateIdModel,
    tx?: PrismaTransaction,
  ): Promise<SeatModel[]> {
    const entity = SeatMapper.toMapGetSeatByConcertDateIdEntity(model);
    const seats = await (tx ?? this.prisma).seat.findMany({
      where: { concertDateId: entity.concertDateId },
    });
    return SeatMapper.toMapSeatModels(seats);
  }
  async updateStatus(
    model: UpdateSeatStatusModel,
    tx?: PrismaTransaction,
  ): Promise<SeatModel> {
    const entity = SeatMapper.toMapUpdateSeatStatusEntity(model);

    const seat = await (tx ?? this.prisma).seat.update({
      where: { id: entity.id },
      data: { status: entity.status },
    });
    return SeatMapper.toMapSeatModel(seat);
  }
}

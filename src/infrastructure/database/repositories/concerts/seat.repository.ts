import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, Seat, SeatStatus } from '@prisma/client';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';

@Injectable()
export class SeatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(
    seats: Omit<Seat, 'id' | 'createdAt' | 'updatedAt'>[],
    tx?: PrismaTransaction,
  ): Promise<Prisma.BatchPayload> {
    return (tx ?? this.prisma).seat.createMany({
      data: seats,
    });
  }

  async findById(seatId: string, tx?: PrismaTransaction): Promise<Seat | null> {
    return (tx ?? this.prisma).seat.findUnique({
      where: { id: seatId },
    });
  }

  async findByConcertDateId(
    concertDateId: string,
    tx?: PrismaTransaction,
  ): Promise<Seat[]> {
    return (tx ?? this.prisma).seat.findMany({
      where: { concertDateId },
    });
  }

  async findAndLockById(tx: PrismaTransaction, seatId: string): Promise<Seat> {
    const [seat] = await (tx ?? this.prisma).$queryRaw<Seat[]>`
    SELECT * FROM "Seat" WHERE id = ${seatId} FOR UPDATE`;
    return seat || null;
  }
  async updateStatus(
    seatId: string,
    status: SeatStatus,
    tx?: PrismaTransaction,
  ) {
    return (tx ?? this.prisma).seat.update({
      where: { id: seatId },
      data: { status },
    });
  }
}

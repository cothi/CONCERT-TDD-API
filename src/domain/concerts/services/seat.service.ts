import { Injectable } from '@nestjs/common';
import { Prisma, Seat, SeatStatus } from '@prisma/client';
import { SeatRepository } from 'src/infrastructure/database/repositories/concerts/seat.repository';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import { CreateSeatsModel } from '../model/seat.model';

@Injectable()
export class SeatService {
  constructor(private readonly seatRepository: SeatRepository) {}
  async createSeat(
    createSeatModel: CreateSeatsModel,
  ): Promise<Prisma.BatchPayload> {
    const seats = this.generateSeatNumber(createSeatModel);
    return await this.seatRepository.createMany(seats);
  }

  async findAndLockSeat(seatId: string, tx?: PrismaTransaction) {
    return this.seatRepository.findAndLockById(tx, seatId);
  }

  async updateSeatStatus(
    seatId: string,
    status: SeatStatus,
    tx?: PrismaTransaction,
  ) {
    return this.seatRepository.updateStatus(seatId, status, tx);
  }

  async getSeatsByConcertDateId(concertDateId: string) {}

  async getSeatBySeatId(seatId: string, tx?: PrismaTransaction) {
    return this.seatRepository.findById(seatId, tx);
  }

  async reserveSeat(seatId: string) {}

  async cancelSeat(seatId: string) {}

  private generateSeatNumber(
    createSeatModel: CreateSeatsModel,
  ): Omit<Seat, 'id' | 'createdAt' | 'updatedAt'>[] {
    return Array.from({ length: createSeatModel.seatNumber }, (_, index) => ({
      concertDateId: createSeatModel.concertDateId,
      seatNumber: index + 1,
      status: createSeatModel.status,
      price: createSeatModel.price,
    }));
  }
}

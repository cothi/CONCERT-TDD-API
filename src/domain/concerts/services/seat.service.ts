import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Seat } from '@prisma/client';
import { SeatRepository } from 'src/infrastructure/database/repositories/concerts/seat.repository';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import {
  CreateSeatsModel,
  GetSeatByConcertDateIdModel,
} from '../model/seat.model';
import { UpdateSeatStatusModel } from './../model/seat.model';

@Injectable()
export class SeatService {
  constructor(private readonly seatRepository: SeatRepository) {}
  async createSeat(
    createSeatModel: CreateSeatsModel,
    tx?: PrismaTransaction,
  ): Promise<Prisma.BatchPayload> {
    const getSeats = await this.seatRepository.findByConcertDateId(
      createSeatModel.concertDateId,
      tx,
    );
    if (getSeats.length > 0) {
      throw new HttpException(
        '이미 시트가 생성되었습니다.',
        HttpStatus.CONFLICT,
      );
    }
    const seats = this.generateSeatNumber(createSeatModel);
    return await this.seatRepository.createMany(seats);
  }

  async findAndLockSeat(seatId: string, tx?: PrismaTransaction) {
    return this.seatRepository.findAndLockById(tx, seatId);
  }
  async findByConcertDateId(concertDateId: string, tx?: PrismaTransaction) {}

  async updateSeatStatus(model: UpdateSeatStatusModel, tx?: PrismaTransaction) {
    return this.seatRepository.updateStatus(model.seatId, model.status, tx);
  }

  async getSeatsByConcertDateId(
    model: GetSeatByConcertDateIdModel,
    tx?: PrismaTransaction,
  ) {
    return await this.seatRepository.findByConcertDateId(
      model.concertDateId,
      tx,
    );
  }

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

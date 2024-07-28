import { Injectable } from '@nestjs/common';
import { Prisma, SeatStatus } from '@prisma/client';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { ErrorFactory } from 'src/common/errors/error-factory.error';
import { SeatRepository } from 'src/infrastructure/concerts/repositories/seat.repository';
import { PrismaTransaction } from 'src/infrastructure/database/prisma/types/prisma.types';
import {
  CreateSeatModel,
  CreateSeatsModel,
  GetSeatByConcertDateIdModel,
  GetSeatBySeatIdModel,
  SeatModel,
} from '../model/seat.model';
import { UpdateSeatStatusModel } from './../model/seat.model';

@Injectable()
export class SeatService {
  constructor(private readonly seatRepository: SeatRepository) {}
  async createSeat(
    model: CreateSeatsModel,
    tx?: PrismaTransaction,
  ): Promise<Prisma.BatchPayload> {
    const findConcertIdSeatModel = GetSeatByConcertDateIdModel.create(
      model.concertDateId,
    );
    const getSeats = await this.seatRepository.findByConcertDateId(
      findConcertIdSeatModel,
      tx,
    );
    if (getSeats.length > 0) {
      throw ErrorFactory.createException(ErrorCode.SEAT_ALREADY_CREATED);
    }
    const seats = this.generateSeatNumber(model);
    return await this.seatRepository.createMany(seats);
  }

  async findAndLockSeat(
    model: GetSeatBySeatIdModel,
    tx?: PrismaTransaction,
  ): Promise<SeatModel> {
    const seat = await this.seatRepository.findAndLockById(model, tx);
    if (!seat) {
      throw ErrorFactory.createException(ErrorCode.SEAT_NOT_FOUND);
    }
    return seat;
  }

  async canReserveSeatWithLock(
    model: GetSeatBySeatIdModel,
    tx?: PrismaTransaction,
  ): Promise<SeatModel> {
    const seat = await this.seatRepository.findAndLockById(model, tx);
    if (!seat) {
      throw ErrorFactory.createException(ErrorCode.SEAT_NOT_FOUND);
    }
    if (seat.status === SeatStatus.AVAILABLE) {
      throw ErrorFactory.createException(ErrorCode.SEAT_NOT_AVAILABLE);
    }
    return seat;
  }
  async updateSeatStatus(
    model: UpdateSeatStatusModel,
    tx?: PrismaTransaction,
  ): Promise<SeatModel> {
    const findSeatModel = GetSeatBySeatIdModel.create(model.seatId);
    const seat = await this.seatRepository.findBySeatId(findSeatModel, tx);
    if (!seat) {
      throw ErrorFactory.createException(ErrorCode.SEAT_NOT_FOUND);
    }
    return this.seatRepository.updateStatus(model, tx);
  }

  async getSeatsByConcertDateId(
    model: GetSeatByConcertDateIdModel,
    tx?: PrismaTransaction,
  ): Promise<SeatModel[]> {
    const seats = await this.seatRepository.findByConcertDateId(model, tx);

    if (seats.length === 0) {
      throw ErrorFactory.createException(ErrorCode.SEAT_NOT_FOUND);
    }
    return seats;
  }

  async getSeatBySeatId(
    model: GetSeatBySeatIdModel,
    tx?: PrismaTransaction,
  ): Promise<SeatModel> {
    const seat = await this.seatRepository.findBySeatId(model, tx);
    if (!seat) {
      throw ErrorFactory.createException(ErrorCode.SEAT_NOT_FOUND);
    }
    return seat;
  }
  private generateSeatNumber(model: CreateSeatsModel): CreateSeatModel[] {
    return Array.from({ length: model.seatNumber }, (_, index) => ({
      concertDateId: model.concertDateId,
      seatNumber: index + 1,
      status: model.status,
      price: model.price,
    }));
  }
  // TODO: Implement the following methods
  async reserveSeat(seatId: string) {}
  // TODO: Implement the following methods
  async cancelSeat(seatId: string) {}
  // TODO: Implement the following methods
  async findByConcertDateId(concertDateId: string, tx?: PrismaTransaction) {}
}

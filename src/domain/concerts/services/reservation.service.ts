import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReservationRepository } from 'src/infrastructure/concerts/repositories/reservation.repository';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import {
  CreateReservationModel,
  GetReservationByIdModel,
  ReservationModel,
} from '../model/reservation.model';
import {
  GetUserReservationsModel,
  UpdateReservationModel,
} from './../model/reservation.model';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async createReservation(
    createReservationModel: CreateReservationModel,
    tx?: PrismaTransaction,
  ): Promise<ReservationModel> {
    return await this.reservationRepository.create(createReservationModel, tx);
  }

  async getReservationById(
    getReservationByIdModel: GetReservationByIdModel,
    tx?: PrismaTransaction,
  ): Promise<ReservationModel | null> {
    const reservation = await this.reservationRepository.getReservationById(
      getReservationByIdModel,
      tx,
    );
    if (!reservation) {
      throw new HttpException(
        '요청한 예약이 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return reservation;
  }
  async getReservationByWithLock(
    getReservationByIdModel: GetReservationByIdModel,
    tx?: PrismaTransaction,
  ): Promise<ReservationModel | null> {
    const reservation =
      await this.reservationRepository.getReservationByWithLock(
        getReservationByIdModel,
        tx,
      );
    if (!reservation) {
      throw new HttpException(
        '요청한 예약이 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return reservation;
  }
  async updateStatus(
    updateReservationModel: UpdateReservationModel,
    tx?: PrismaTransaction,
  ): Promise<ReservationModel> {
    const model = new GetReservationByIdModel();
    model.reservationId = updateReservationModel.reservationId;
    const reservation =
      await this.reservationRepository.getReservationById(model);

    if (!reservation) {
      throw new HttpException(
        '요청한 예약이 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.reservationRepository.updateStatus(
      updateReservationModel,
      tx,
    );
  }

  async getUserReservations(
    getUserReservationsModel: GetUserReservationsModel,
  ) {
    return await this.reservationRepository.findByUserId(
      getUserReservationsModel,
    );
  }
}

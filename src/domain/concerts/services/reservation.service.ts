import { Injectable } from '@nestjs/common';
import { Reservation } from '@prisma/client';
import { ReservationRepository } from 'src/infrastructure/database/repositories/concerts/reservation.repository';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import {
  CreateReservationModel,
  GetReservationByIdModel,
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
  ): Promise<Reservation> {
    return await this.reservationRepository.create(createReservationModel, tx);
  }

  async getReservationById(
    getReservationByIdModel: GetReservationByIdModel,
    tx?: PrismaTransaction,
  ): Promise<Reservation | null> {
    return await this.reservationRepository.getReservationById(
      getReservationByIdModel,
      tx,
    );
  }
  async updateStatus(
    updateReservationModel: UpdateReservationModel,
    tx?: PrismaTransaction,
  ): Promise<Reservation> {
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

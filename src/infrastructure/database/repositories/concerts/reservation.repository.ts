import { Injectable } from '@nestjs/common';
import { Reservation, ReservationStatus } from '@prisma/client';
import {
  CreateReservationModel,
  UpdateReservationModel,
} from 'src/domain/concerts/model/reservation.model';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import {
  GetReservationByIdModel,
  GetUserReservationsModel,
} from './../../../../domain/concerts/model/reservation.model';

@Injectable()
export class ReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createReservationModel: CreateReservationModel,
    tx?: PrismaTransaction,
  ): Promise<Reservation> {
    return await (tx ?? this.prisma).reservation.create({
      data: {
        userId: createReservationModel.userId,
        concertId: createReservationModel.concertId,
        concertDateId: createReservationModel.concertDateId,
        seatId: createReservationModel.seatId,
        status: ReservationStatus.PENDING,
        expiresAt: createReservationModel.expireAt,
      },
    });
  }

  async getReservationById(
    getReservationByIdModel: GetReservationByIdModel,
    tx?: PrismaTransaction,
  ): Promise<Reservation | null> {
    return await (tx ?? this.prisma).reservation.findUnique({
      where: { id: getReservationByIdModel.reservationId },
    });
  }

  async updateStatus(
    updateReservationModel: UpdateReservationModel,
    tx?: PrismaTransaction,
  ): Promise<Reservation> {
    return await (tx ?? this.prisma).reservation.update({
      where: { id: updateReservationModel.reservationId },
      data: { status: updateReservationModel.status },
    });
  }
  async findByUserId(getUserReservationsModel: GetUserReservationsModel) {
    return await this.prisma.reservation.findMany({
      where: { userId: getUserReservationsModel.userId },
      include: {
        concert: { select: { name: true } },
        concertDate: { select: { date: true } },
        seat: { select: { seatNumber: true, price: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

// expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now

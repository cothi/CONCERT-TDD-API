import { Injectable } from '@nestjs/common';
import { Reservation } from '@prisma/client';
import {
  CreateReservationModel,
  ReservationModel,
  UpdateReservationModel,
} from 'src/domain/concerts/model/reservation.model';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import {
  GetReservationByIdModel,
  GetUserReservationsModel,
} from '../../../domain/concerts/model/reservation.model';
import { ReservationMapper } from '../mapper/reservation.mapper';

@Injectable()
export class ReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    model: CreateReservationModel,
    tx?: PrismaTransaction,
  ): Promise<ReservationModel> {
    const entity = ReservationMapper.toMapCreateReservationEntity(model);
    const reservation = await (tx ?? this.prisma).reservation.create({
      data: {
        userId: entity.userId,
        concertId: entity.concertId,
        concertDateId: entity.concertDateId,
        seatId: entity.seatId,
        status: entity.status,
        expiresAt: entity.expiresAt,
      },
    });
    return ReservationMapper.toMapReservationModel(reservation);
  }

  async getReservationById(
    model: GetReservationByIdModel,
    tx?: PrismaTransaction,
  ): Promise<ReservationModel | null> {
    const entity = ReservationMapper.toMapGetReservationByIdEntity(model);
    const reservation = await (tx ?? this.prisma).reservation.findUnique({
      where: { id: entity.id },
    });
    return ReservationMapper.toMapReservationModel(reservation);
  }
  async getReservationByWithLock(
    model: GetReservationByIdModel,
    tx?: PrismaTransaction,
  ): Promise<ReservationModel | null> {
    const entity = ReservationMapper.toMapGetReservationByIdEntity(model);
    const [reservation] = await (tx ?? this.prisma).$queryRaw<Reservation[]>`
    SELECT * FROM "Reservation" WHERE id = ${entity.id} FOR UPDATE NOWAIT`;
    return ReservationMapper.toMapReservationModel(reservation);
  }

  async updateStatus(
    model: UpdateReservationModel,
    tx?: PrismaTransaction,
  ): Promise<ReservationModel> {
    const entity = ReservationMapper.toMapUpdateReservationStatusEntity(model);
    const reservation = await (tx ?? this.prisma).reservation.update({
      where: { id: entity.id },
      data: { status: entity.status },
    });
    return ReservationMapper.toMapReservationModel(reservation);
  }
  async findByUserId(model: GetUserReservationsModel) {
    const entity = ReservationMapper.toMapFindReservationByUserIdEntity(model);
    const reservations = await this.prisma.reservation.findMany({
      where: { userId: entity.userId },
      include: {
        concert: { select: { name: true } },
        concertDate: { select: { date: true } },
        seat: { select: { seatNumber: true, price: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return reservations;
  }
}

// expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now

import { Injectable } from '@nestjs/common';
import { Prisma, Reservation, ReservationStatus } from '@prisma/client';
import { ReservationRepository } from 'src/infrastructure/database/repositories/concerts/reservation.repository';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async createReservation(
    userId: string,
    seatId: string,
    concertDateId: string,
    concertId: string,
    status: ReservationStatus,
    tx?: PrismaTransaction,
  ): Promise<Reservation> {
    const reservationData: Prisma.ReservationCreateInput = {
      user: { connect: { id: userId } },
      seat: { connect: { id: seatId } },
      concertDate: { connect: { id: concertDateId } },
      concert: { connect: { id: concertId } },
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      status: status,
    };
    return this.reservationRepository.create(reservationData, tx);
  }
}

import { PickType } from '@nestjs/swagger';
import { ReservationStatus } from '@prisma/client';
export class ReservationModel {
  reservationId: string;
  concertId: string;
  concertDateId: string;
  userId: string;
  seatId: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
  expireAt: Date;
  static create(
    reservationId: string,
    concertId: string,
    concertDateId: string,
    userId: string,
    seatId: string,
    createdAt: Date,
    updatedAt: Date,
    expiresAt: Date,
  ): ReservationModel {
    const model = new ReservationModel();
    model.reservationId = reservationId;
    model.concertDateId = concertDateId;
    model.concertId = concertId;
    model.seatId = seatId;
    model.userId = userId;
    model.createdAt = createdAt;
    model.updatedAt = updatedAt;
    model.expireAt = expiresAt;
    return model;
  }
}

export class CreateReservationModel extends PickType(ReservationModel, [
  'userId',
  'seatId',
  'concertDateId',
  'concertId',
  'status',
  'expireAt',
]) {
  static create(
    userId: string,
    seatId: string,
    concertDateId: string,
    concertId: string,
    status: ReservationStatus,
    expireAt: Date,
  ) {
    const model = new CreateReservationModel();
    model.userId = userId;
    model.seatId = seatId;
    model.concertDateId = concertDateId;
    model.concertId = concertId;
    model.status = status;
    model.expireAt = expireAt;
    return model;
  }
}

export class UpdateReservationModel extends PickType(ReservationModel, [
  'status',
  'reservationId',
]) {
  static create(status: ReservationStatus, reservationId: string) {
    const model = new UpdateReservationModel();
    model.reservationId = reservationId;
    model.status = status;
    return model;
  }
}

export class GetUserReservationsModel extends PickType(ReservationModel, [
  'userId',
]) {
  static create(userId: string) {
    const model = new GetUserReservationsModel();
    model.userId = userId;
    return model;
  }
}

export class GetReservationByIdModel extends PickType(ReservationModel, [
  'reservationId',
]) {
  static create(reservationId: string) {
    const model = new GetReservationByIdModel();
    model.reservationId = reservationId;
    return model;
  }
}

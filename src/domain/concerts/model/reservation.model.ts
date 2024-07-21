import { PickType } from '@nestjs/swagger';
import { ReservationStatus } from '@prisma/client';
export class reservationModel {
  constructor(
    public reservationId: string,
    public concertId: string,
    public concertDateId: string,
    public userId: string,
    public seatId: string,
    public status: ReservationStatus,
    public quantity: number,
    public createdAt: Date,
    public updatedAt: Date,
    public expireAt: Date,
  ) {}
}

export class CreateReservationModel extends PickType(reservationModel, [
  'userId',
  'seatId',
  'concertDateId',
  'concertId',
  'status',
  'expireAt',
]) {}

export class UpdateReservationModel extends PickType(reservationModel, [
  'status',
  'reservationId',
]) {}

export class GetUserReservationsModel extends PickType(reservationModel, [
  'userId',
]) {}

export class GetReservationByIdModel extends PickType(reservationModel, [
  'reservationId',
]) {}

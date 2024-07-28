import { PickType } from '@nestjs/swagger';
import { ReservationStatus } from '@prisma/client';

export class ReservationEntity {
  id: string;
  userId: string;
  concertId: string;
  concertDateId: string;
  seatId: string;
  status: ReservationStatus;
  expiresAt: Date;
  creaetdAt: Date;
  updatedAt: Date;
}

export class CreateReservationEntity extends PickType(ReservationEntity, [
  'userId',
  'concertId',
  'concertDateId',
  'seatId',
  'status',
  'expiresAt',
]) {}

export class GetReservationByIdEntity extends PickType(ReservationEntity, [
  'id',
]) {}
export class UpdateReservationStatusEntity extends PickType(ReservationEntity, [
  'id',
  'status',
]) {}

export class FindReservationByUserIdEntity extends PickType(ReservationEntity, [
  'userId',
]) {}

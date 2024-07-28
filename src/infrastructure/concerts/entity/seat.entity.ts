import { PickType } from '@nestjs/swagger';
import { SeatStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class SeatEntity {
  id: string;
  concertDateId: string;
  seatNumber: number;
  status: SeatStatus;
  price: Decimal;
}

export class CreateSeatEntity extends PickType(SeatEntity, [
  'concertDateId',
  'seatNumber',
  'price',
  'status',
]) {}

export class GetSeatByIdEntity extends PickType(SeatEntity, ['id']) {}
export class GetSeatByConcertDateIdEntity extends PickType(SeatEntity, [
  'concertDateId',
]) {}

export class UpdateSeatStatusEntity extends PickType(SeatEntity, [
  'status',
  'id',
]) {}

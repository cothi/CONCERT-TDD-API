import { PickType } from '@nestjs/swagger';
import { SeatStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class SeatModel {
  seatId: string;
  concertDateId: string;
  seatNumber: number;
  status: SeatStatus;
  price: Decimal;
}

export class CreateSeatsModel extends PickType(SeatModel, [
  'concertDateId',
  'seatNumber',
  'status',
  'price',
]) {}

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
/**
 *
 *
 * @export
 * @class CreateSeatsModel
 * @extends {PickType(SeatModel, [
 *   'concertDateId',
 *   'seatNumber',
 *   'status',
 *   'price',
 * ])}
 */
export class CreateSeatsModel extends PickType(SeatModel, [
  'concertDateId',
  'seatNumber',
  'status',
  'price',
]) {}

export class UpdateSeatStatusModel extends PickType(SeatModel, [
  'seatId',
  'status',
]) {}

export class GetSeatBySeatIdModel extends PickType(SeatModel, ['seatId']) {}

import { PickType } from '@nestjs/swagger';
import { SeatStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class SeatModel {
  seatId: string;
  concertDateId: string;
  seatNumber: number;
  status: SeatStatus;
  price: Decimal;

  static create(
    seatId: string,
    concertDateId: string,
    seatNumber: number,
    status: SeatStatus,
    price: Decimal,
  ) {
    const model = new SeatModel();

    model.concertDateId = concertDateId;
    model.seatId = seatId;
    model.seatNumber = seatNumber;
    model.status = status;
    model.price = price;
    return model;
  }
}

export class CreateSeatsModel extends PickType(SeatModel, [
  'concertDateId',
  'seatNumber',
  'status',
  'price',
]) {
  static create(
    concertDateId: string,
    seatNumber: number,
    status: SeatStatus,
    price: Decimal,
  ): CreateSeatsModel {
    const model = new CreateSeatsModel();

    model.concertDateId = concertDateId;
    model.price = price;
    model.status = status;
    model.seatNumber = seatNumber;
    return model;
  }
}
export class CreateSeatModel extends PickType(SeatModel, [
  'concertDateId',
  'seatNumber',
  'status',
  'price',
]) {
  static create(
    concertDateId: string,
    seatNumber: number,
    status: SeatStatus,
    price: Decimal,
  ): CreateSeatModel {
    const model = new CreateSeatsModel();

    model.concertDateId = concertDateId;
    model.price = price;
    model.status = status;
    model.seatNumber = seatNumber;
    return model;
  }
}

export class UpdateSeatStatusModel extends PickType(SeatModel, [
  'seatId',
  'status',
]) {
  static create(seatId: string, status: SeatStatus): UpdateSeatStatusModel {
    const model = new UpdateSeatStatusModel();
    model.status = status;
    model.seatId = seatId;
    return model;
  }
}

export class GetSeatBySeatIdModel extends PickType(SeatModel, ['seatId']) {
  static create(seatId: string): GetSeatBySeatIdModel {
    const model = new GetSeatBySeatIdModel();
    model.seatId = seatId;
    return model;
  }
}

export class GetSeatByConcertDateIdModel extends PickType(SeatModel, [
  'concertDateId',
]) {
  static create(concertDateId: string): GetSeatByConcertDateIdModel {
    const model = new GetSeatByConcertDateIdModel();
    model.concertDateId = concertDateId;
    return model;
  }
}

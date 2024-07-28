import { PickType } from '@nestjs/swagger';

export class ConcertDateEntity {
  concertDateId: string;
  concertId: string;
  date: Date;
  totalSeat: number;
  availableSeatCount: number;
}

export class CreateConcertDateEntity extends PickType(ConcertDateEntity, [
  'concertId',
  'date',
  'totalSeat',
  'totalSeat',
]) {}

export class FindConcertDateByDateIdEntity extends PickType(ConcertDateEntity, [
  'concertDateId',
]) {}

export class FindConcertDateByIdEntity extends PickType(ConcertDateEntity, [
  'concertId',
]) {}

export class FindConcertDateByDateEntity extends PickType(ConcertDateEntity, [
  'date',
  'concertId',
]) {}

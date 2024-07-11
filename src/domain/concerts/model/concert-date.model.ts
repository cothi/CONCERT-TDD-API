import { PickType } from '@nestjs/swagger';

export class ConcertDateModel {
  concertId: string;
  date: Date;
  totalSeat: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateConcertDateModel extends PickType(ConcertDateModel, [
  'concertId',
  'date',
  'totalSeat',
]) {}

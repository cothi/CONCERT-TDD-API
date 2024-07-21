import { PickType } from '@nestjs/swagger';

export class ConcertModel {
  concertId: string;
  name: string;
}

export class CreateConcertModel extends PickType(ConcertModel, ['name']) {}

export class FindConcertModel extends PickType(ConcertModel, ['concertId']) {}

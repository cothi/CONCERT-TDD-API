import { PickType } from '@nestjs/swagger';

export class concertEntity {
  concertId: string;
  name: string;
}

export class CreateConcertEntity extends PickType(concertEntity, ['name']) {}
export class FindConcertByIdEntity extends PickType(concertEntity, [
  'concertId',
]) {}
export class FindConcertByNameEntity extends PickType(concertEntity, [
  'name',
]) {}

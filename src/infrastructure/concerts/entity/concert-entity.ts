import { PickType } from '@nestjs/swagger';

export class concertEntity {
  concertId: string;
  name: string;
}

export class CreateConcertEntity extends PickType(concertEntity, ['name']) {}

import { PickType } from '@nestjs/swagger';
import { ConcertDateModel } from 'src/domain/concerts/model/concert-date.model';

export class CreateConcertDateCommand extends PickType(ConcertDateModel, [
  'concertId',
  'date',
  'totalSeat',
]) {}

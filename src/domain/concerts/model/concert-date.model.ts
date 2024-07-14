import { PickType } from '@nestjs/swagger';

export class ConcertDateModel {
  constructor(
    public concertDateId: string,
    public concertId: string,
    public date: Date,
    public totalSeat: number,
    public availableSeatCount: number,
  ) {}
}

/**
 *
 *
 * @export
 * @class CreateConcertDateModel
 * @extends {PickType(ConcertDateModel, [
 *   'concertId',
 *   'date',
 *   'totalSeat',
 * ])}
 */
export class CreateConcertDateModel extends PickType(ConcertDateModel, [
  'concertId',
  'date',
  'totalSeat',
]) {}

/**
 *
 *
 * @export
 * @class Get Concert Date ByConcertIdModel
 * @extends {PickType(ConcertDateModel, [
 *   'concertId',
 * ])}
 */
export class GCDByConcertIdModel extends PickType(ConcertDateModel, [
  'concertId',
]) {}

/**
 *
 *
 * @export
 * @class Get Concert Date ByConcertDateModel
 * @extends {PickType(
 *   ConcertDateModel,
 *   ['concertDateId'],
 * )}
 */
export class GCDByConcertDateIdModel extends PickType(ConcertDateModel, [
  'concertDateId',
]) {}

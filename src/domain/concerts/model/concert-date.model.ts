import { PickType } from '@nestjs/swagger';

export class ConcertDateModel {
  constructor(
    public concertDateId: string,
    public concertId: string,
    public date: Date,
    public totalSeat: number,
    public availableSeatCount: number,
  ) {}
  static create(
    concertDateId: string,
    concertId: string,
    date: Date,
    totalSeat: number,
    availableSeatCount: number,
  ): ConcertDateModel {
    const model = new ConcertDateModel(
      concertDateId,
      concertId,
      date,
      totalSeat,
      availableSeatCount,
    );
    return model;
  }
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
]) {
  static create(
    concertId: string,
    date: Date,
    totalSeat: number,
  ): CreateConcertDateModel {
    const model = new CreateConcertDateModel();
    model.concertId = concertId;
    model.date = date;
    model.totalSeat = totalSeat;
    return model;
  }
}

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
]) {
  static create(concertId: string) {
    const model = new GCDByConcertIdModel();
    model.concertId = concertId;
    return model;
  }
}

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
]) {
  static create(concertDateId: string) {
    const model = new GCDByConcertDateIdModel();
    model.concertDateId = concertDateId;
    return model;
  }
}

import { PickType } from '@nestjs/swagger';

export class ConcertModel {
  concertId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  static create(
    concertId: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
  ): ConcertModel {
    const model = new ConcertModel();
    model.concertId = concertId;
    model.name = name;
    model.createdAt = createdAt;
    model.updatedAt = updatedAt;
    return model;
  }
}

export class CreateConcertModel extends PickType(ConcertModel, ['name']) {
  static create(name: string) {
    const model = new CreateConcertModel();
    model.name = name;
    return model;
  }
}

export class FindConcertByIdModel extends PickType(ConcertModel, [
  'concertId',
]) {
  static create(concertId: string) {
    const model = new FindConcertByIdModel();
    model.concertId = concertId;
    return model;
  }
}
export class FindConcertByNameModel extends PickType(ConcertModel, ['name']) {
  static create(name: string) {
    const model = new FindConcertByNameModel();
    model.name = name;
    return model;
  }
}

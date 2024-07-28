import {
  ConcertDateModel,
  CreateConcertDateModel,
  GCDByConcertDateIdModel,
  GCDByConcertIdModel,
} from 'src/domain/concerts/model/concert-date.model';
import {
  FindConcertDateByDateIdEntity,
  FindConcertDateByIdEntity,
  FindConcertDateByDateEntity,
  CreateConcertDateEntity,
} from '../entity/concert-date.entity';
import { ConcertDate } from '@prisma/client';

export class ConcertDateMapper {
  static toMapCreateConcertEntity(
    model: CreateConcertDateModel,
  ): CreateConcertDateEntity {
    const entity = new CreateConcertDateEntity();
    entity.concertId = model.concertId;
    entity.date = model.date;
    entity.totalSeat = model.totalSeat;
    return entity;
  }

  static toMapConcertByDateIdEntity(
    model: GCDByConcertDateIdModel,
  ): FindConcertDateByDateIdEntity {
    const entity = new FindConcertDateByDateIdEntity();
    entity.concertDateId = model.concertDateId;
    return entity;
  }
  static toMapConcertByConcertIdEntity(model: GCDByConcertIdModel) {
    const entity = new FindConcertDateByIdEntity();
    entity.concertId = model.concertId;
    return entity;
  }

  static toMapConcertDateByDateEntity(model: CreateConcertDateModel) {
    const entity = new FindConcertDateByDateEntity();
    entity.date = model.date;
    entity.concertId = model.concertId;
    return entity;
  }

  static toMapConcertDateModel(entity: ConcertDate): ConcertDateModel {
    const model = ConcertDateModel.create(
      entity.id,
      entity.concertId,
      entity.date,
      entity.totalSeat,
      entity.availableSeatCount,
    );
    return model;
  }
  static toMapConcertDatesModel(entitys: ConcertDate[]): ConcertDateModel[] {
    const models = entitys.map((entity) => this.toMapConcertDateModel(entity));
    return models;
  }
}

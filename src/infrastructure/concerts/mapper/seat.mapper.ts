import {
  CreateSeatModel,
  GetSeatByConcertDateIdModel,
  GetSeatBySeatIdModel,
  SeatModel,
  UpdateSeatStatusModel,
} from 'src/domain/concerts/model/seat.model';
import {
  CreateSeatEntity,
  GetSeatByConcertDateIdEntity,
  GetSeatByIdEntity,
  UpdateSeatStatusEntity,
} from '../entity/seat.entity';
import { Seat } from '@prisma/client';

export class SeatMapper {
  static toMapCreateSeatEntity(model: CreateSeatModel): CreateSeatEntity {
    const entity = new CreateSeatEntity();
    entity.concertDateId = model.concertDateId;
    entity.price = model.price;
    entity.seatNumber = model.seatNumber;
    entity.status = model.status;
    return entity;
  }
  static toMapCreateSeatsEntity(models: CreateSeatModel[]): CreateSeatEntity[] {
    return models.map((model) => this.toMapCreateSeatEntity(model));
  }
  static toMapGetSeatByIdEntity(
    model: GetSeatBySeatIdModel,
  ): GetSeatByIdEntity {
    const entity = new GetSeatByIdEntity();
    entity.id = model.seatId;
    return entity;
  }
  static toMapGetSeatByConcertDateIdEntity(
    model: GetSeatByConcertDateIdModel,
  ): GetSeatByConcertDateIdEntity {
    const entity = new GetSeatByConcertDateIdEntity();
    entity.concertDateId = model.concertDateId;
    return entity;
  }
  static toMapUpdateSeatStatusEntity(
    model: UpdateSeatStatusModel,
  ): UpdateSeatStatusEntity {
    const entity = new UpdateSeatStatusEntity();
    entity.status = model.status;
    entity.id = model.seatId;
    return entity;
  }

  static toMapSeatModel(entity: Seat): SeatModel {
    if (!entity) return null;
    const model = SeatModel.create(
      entity.id,
      entity.concertDateId,
      entity.seatNumber,
      entity.status,
      entity.price,
    );
    return model;
  }

  static toMapSeatModels(entities: Seat[]): SeatModel[] {
    return entities.map((entity) => this.toMapSeatModel(entity));
  }
}

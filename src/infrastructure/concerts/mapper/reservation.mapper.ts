import {
  CreateReservationModel,
  GetReservationByIdModel,
  GetUserReservationsModel,
  ReservationModel,
  UpdateReservationModel,
} from 'src/domain/concerts/model/reservation.model';
import {
  CreateReservationEntity,
  FindReservationByUserIdEntity,
  GetReservationByIdEntity,
  UpdateReservationStatusEntity,
} from '../entity/reservation.entity';
import { Reservation } from '@prisma/client';

export class ReservationMapper {
  static toMapCreateReservationEntity(
    model: CreateReservationModel,
  ): CreateReservationEntity {
    const entity = new CreateReservationEntity();
    entity.concertDateId = model.concertDateId;
    entity.concertId = model.concertId;
    entity.expiresAt = model.expireAt;
    entity.seatId = model.seatId;
    entity.status = model.status;
    entity.userId = model.userId;
    return entity;
  }

  static toMapGetReservationByIdEntity(
    model: GetReservationByIdModel,
  ): GetReservationByIdEntity {
    const entity = new GetReservationByIdEntity();
    entity.id = model.reservationId;
    return entity;
  }

  static toMapUpdateReservationStatusEntity(
    model: UpdateReservationModel,
  ): UpdateReservationStatusEntity {
    const entity = new UpdateReservationStatusEntity();
    entity.id = model.reservationId;
    entity.status = model.status;
    return entity;
  }

  static toMapFindReservationByUserIdEntity(
    model: GetUserReservationsModel,
  ): FindReservationByUserIdEntity {
    const entity = new FindReservationByUserIdEntity();
    entity.userId = model.userId;
    return entity;
  }

  static toMapReservationModel(entity: Reservation): ReservationModel {
    if (!entity) return null;
    const model = ReservationModel.create(
      entity.id,
      entity.concertId,
      entity.concertDateId,
      entity.userId,
      entity.seatId,
      entity.createdAt,
      entity.updatedAt,
      entity.expiresAt,
    );
    return model;
  }

  static toMapReservationModels(entities: Reservation[]): ReservationModel[] {
    return entities.map((entity) => this.toMapReservationModel(entity));
  }
}

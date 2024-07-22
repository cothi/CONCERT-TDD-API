import {
  ConcertModel,
  CreateConcertModel,
  FindConcertByIdModel,
  FindConcertByNameModel,
} from 'src/domain/concerts/model/concert.model';
import {
  CreateConcertEntity,
  FindConcertByIdEntity,
  FindConcertByNameEntity,
} from '../entity/concert-entity';
import { Concert } from '@prisma/client';

export class ConcertMapper {
  static toMapCreateConcertEntity(
    model: CreateConcertModel,
  ): CreateConcertEntity {
    const entity = new CreateConcertEntity();
    entity.name = model.name;
    return entity;
  }

  static toMapFindConcertByIdEntity(model: FindConcertByIdModel) {
    const entity = new FindConcertByIdEntity();
    entity.concertId = model.concertId;
    return entity;
  }
  static toMapFindConcertByNameEntity(model: FindConcertByNameModel) {
    const entity = new FindConcertByNameEntity();
    entity.name = model.name;
    return entity;
  }
  static toMapConcertsModel(entitys: Concert[]): ConcertModel[] {
    const models = entitys.map((entity) => this.toMapConcertModel(entity));
    return models;
  }

  static toMapConcertModel(entity: Concert) {
    const model = ConcertModel.create(
      entity.id,
      entity.name,
      entity.createdAt,
      entity.updatedAt,
    );
    return model;
  }
}

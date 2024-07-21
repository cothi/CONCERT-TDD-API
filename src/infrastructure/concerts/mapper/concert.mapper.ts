import {
  ConcertModel,
  CreateConcertModel,
} from 'src/domain/concerts/model/concert.model';
import { CreateConcertEntity } from '../entity/concert-entity';
import { Concert } from '@prisma/client';

export class ConcertMapper {
  static toMapCreateConcertEntity(
    model: CreateConcertModel,
  ): CreateConcertEntity {
    const entity = new CreateConcertEntity();
    entity.name = model.name;
    return entity;
  }

  static toMapConcertModel(entity: Concert) {
    const model = new ConcertModel();
    model.concertId;
  }
}

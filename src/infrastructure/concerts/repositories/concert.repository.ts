import { Injectable } from '@nestjs/common';
import {
  ConcertModel,
  CreateConcertModel,
  FindConcertByIdModel,
  FindConcertByNameModel,
} from 'src/domain/concerts/model/concert.model';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ConcertMapper } from '../mapper/concert.mapper';

@Injectable()
export class ConcertRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(model: CreateConcertModel) {
    const entity = ConcertMapper.toMapCreateConcertEntity(model);
    const concert = await this.prisma.concert.create({
      data: {
        name: entity.name,
      },
    });
    return ConcertMapper.toMapConcertModel(concert);
  }

  async findAllConcert(): Promise<ConcertModel[]> {
    const conserts = await this.prisma.concert.findMany();
    return ConcertMapper.toMapConcertsModel(conserts);
  }
  async findById(model: FindConcertByIdModel): Promise<ConcertModel | null> {
    const entity = ConcertMapper.toMapFindConcertByIdEntity(model);
    const concert = await this.prisma.concert.findUnique({
      where: { id: entity.concertId },
    });
    return ConcertMapper.toMapConcertModel(concert);
  }

  async findByConcertName(
    model: FindConcertByNameModel,
  ): Promise<ConcertModel | null> {
    const entity = ConcertMapper.toMapFindConcertByNameEntity(model);
    const concert = await this.prisma.concert.findUnique({
      where: { name: entity.name },
    });
    return ConcertMapper.toMapConcertModel(concert);
  }
}

import { Injectable } from '@nestjs/common';
import { Concert } from '@prisma/client';
import { CreateConcertModel } from 'src/domain/concerts/model/concert.model';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ConcertRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createConcertModel: CreateConcertModel) {
    return this.prisma.concert.create({
      data: {
        name: createConcertModel.name,
      },
    });
  }

  async findAllConcert(): Promise<Concert[]> {
    return await this.prisma.concert.findMany();
  }

  async findById(id: string): Promise<Concert | null> {
    return await this.prisma.concert.findUnique({
      where: { id },
    });
  }

  async findByConcertName(name: string): Promise<Concert | null> {
    return await this.prisma.concert.findUnique({
      where: { name: name },
    });
  }
}

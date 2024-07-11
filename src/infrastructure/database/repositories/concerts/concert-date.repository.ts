import { Injectable } from '@nestjs/common';
import { ConcertDate } from '@prisma/client';
import { CreateConcertDateModel } from 'src/domain/concerts/model/concert-date.model';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ConcertDateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateConcertDateModel): Promise<ConcertDate> {
    return await this.prisma.concertDate.create({
      data: {
        concertId: data.concertId,
        date: data.date,
        totalSeat: data.totalSeat,
        availableSeatCount: data.totalSeat,
      },
    });
  }

  async findById(dateId: string): Promise<ConcertDate | null> {
    return await this.prisma.concertDate.findUnique({
      where: { id: dateId },
    });
  }

  async findByConcertId(concertId: string): Promise<ConcertDate[]> {
    return this.prisma.concertDate.findMany({ where: { concertId } });
  }
}

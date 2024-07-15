import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Concert } from '@prisma/client';
import { ConcertRepository } from 'src/infrastructure/database/repositories/concerts/concert.repository';
import { CreateConcertModel, FindConcertModel } from '../model/concert.model';

@Injectable()
export class ConcertService {
  constructor(private readonly concertRepository: ConcertRepository) {}

  async createConcert(
    createConcertModel: CreateConcertModel,
  ): Promise<Concert> {
    const concert = await this.concertRepository.findByConcertName(
      createConcertModel.name,
    );

    if (concert) {
      throw new HttpException(
        '동일한 이름의 콘서트가 존재합니다.',
        HttpStatus.CONFLICT,
      );
    }
    return this.concertRepository.create({
      name: createConcertModel.name,
    });
  }

  async getConcertById(findConcertModel: FindConcertModel): Promise<Concert> {
    const concert = this.concertRepository.findById(findConcertModel.concertId);
    if (!concert) {
      throw new HttpException(
        '콘서트가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return concert;
  }

  async getAllConcerts(): Promise<Concert[]> {
    return this.concertRepository.findAllConcert();
  }
}

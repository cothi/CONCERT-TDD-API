import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConcertRepository } from 'src/infrastructure/concerts/repositories/concert.repository';
import {
  ConcertModel,
  CreateConcertModel,
  FindConcertByIdModel,
  FindConcertByNameModel,
} from '../model/concert.model';

@Injectable()
export class ConcertService {
  constructor(private readonly concertRepository: ConcertRepository) {}

  async createConcert(model: CreateConcertModel): Promise<ConcertModel> {
    const findModel = FindConcertByNameModel.create(model.name);
    const concert = await this.concertRepository.findByConcertName(findModel);
    if (concert) {
      throw new HttpException(
        '동일한 이름의 콘서트가 존재합니다.',
        HttpStatus.CONFLICT,
      );
    }
    return await this.concertRepository.create(model);
  }

  async getConcertById(model: FindConcertByIdModel): Promise<ConcertModel> {
    const concert = await this.concertRepository.findById(model);
    if (!concert) {
      throw new HttpException(
        '콘서트가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return concert;
  }

  async getAllConcerts(): Promise<ConcertModel[]> {
    return await this.concertRepository.findAllConcert();
  }
}

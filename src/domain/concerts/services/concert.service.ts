import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { ErrorFactory } from 'src/common/errors/error-factory.error';
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
      throw ErrorFactory.createException(ErrorCode.CONCERT_SAME_EXIST);
    }
    return await this.concertRepository.create(model);
  }

  async getConcertById(model: FindConcertByIdModel): Promise<ConcertModel> {
    const concert = await this.concertRepository.findById(model);
    if (!concert) {
      throw ErrorFactory.createException(ErrorCode.CONCERT_NOT_FOUND);
    }
    return concert;
  }

  async getAllConcerts(): Promise<ConcertModel[]> {
    return await this.concertRepository.findAllConcert();
  }
}

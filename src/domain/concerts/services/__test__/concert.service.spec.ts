/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';
import { ConcertService } from '../concert.service';
import { ConcertRepository } from 'src/infrastructure/database/repositories/concerts/concert.repository';
import {
  CreateConcertModel,
  FindConcertModel,
} from '../../model/concert.model';
import { Concert } from '@prisma/client';
describe('ConcertService', () => {
  let service: ConcertService;
  let repository: jest.Mocked<ConcertRepository>;
  const expectedConcert: Concert = {
    id: '1',
    name: 'Test Concert',
    updatedAt: new Date(),
    createdAt: new Date(),
  };
  const expectedConcert2: Concert = {
    id: '2',
    name: 'Test Concert2',
    updatedAt: new Date(),
    createdAt: new Date(),
  };
  const expectedConcerts: Concert[] = [expectedConcert, expectedConcert2];

  beforeEach(async () => {
    const repositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findAllConcert: jest.fn(),
    };
    const module = await Test.createTestingModule({
      providers: [
        ConcertService,
        {
          provide: ConcertRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ConcertService>(ConcertService);
    repository = module.get(ConcertRepository);
  });

  describe('createConcert', () => {
    it('콘서트 생성 요청 시, 생성되어야 합니다.', async () => {
      const createConcertModel: CreateConcertModel = { name: 'Test Concert' };

      repository.create.mockResolvedValue(expectedConcert);

      const result = await service.createConcert(createConcertModel);

      expect(repository.create).toHaveBeenCalledWith({ name: 'Test Concert' });
      expect(result).toEqual(expectedConcert);
    });
  });

  describe('getConcertById', () => {
    it('concert id로 조회 시, 해당 콘서트가 조회되어야 합니다.', async () => {
      const findConcertModel: FindConcertModel = { concertId: '1' };

      repository.findById.mockResolvedValue(expectedConcert);

      const result = await service.getConcertById(findConcertModel);

      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(expectedConcert);
    });

    it('concert id로 조회 시, 존재하지 않으면, null 을 반환 합니다.', async () => {
      const findConcertModel: FindConcertModel = { concertId: '2' };
      repository.findById.mockResolvedValue(null);
      const result = await service.getConcertById(findConcertModel);

      expect(repository.findById).toHaveBeenCalledWith('2');
      expect(result).toBeNull();
    });
  });

  describe('getAllConcerts', () => {
    it('모든 콘서트를 조회합니다.', async () => {
      repository.findAllConcert.mockResolvedValue(expectedConcerts);

      const result = await service.getAllConcerts();

      expect(repository.findAllConcert).toHaveBeenCalled();
      expect(result).toEqual(expectedConcerts);
    });
  });
});

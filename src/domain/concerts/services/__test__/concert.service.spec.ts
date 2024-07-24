/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';
import { ConcertRepository } from 'src/infrastructure/concerts/repositories/concert.repository';
import { ConcertModel, CreateConcertModel } from '../../model/concert.model';
import { ConcertService } from '../concert.service';
describe('ConcertService', () => {
  let service: ConcertService;
  let repository: jest.Mocked<ConcertRepository>;
  const expectedConcert: ConcertModel = {
    concertId: '1',
    name: 'Test Concert',
    updatedAt: new Date(),
    createdAt: new Date(),
  };
  const expectedConcert2: ConcertModel = {
    concertId: '2',
    name: 'Test Concert2',
    updatedAt: new Date(),
    createdAt: new Date(),
  };
  const expectedConcerts: ConcertModel[] = [expectedConcert, expectedConcert2];

  beforeEach(async () => {
    const repositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findAllConcert: jest.fn(),
      findByConcertName: jest.fn(),
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
      const findConcertModel = { concertId: '2' };
      repository.findById.mockResolvedValue(expectedConcert);
      const result = await service.getConcertById(findConcertModel);
      expect(result).toEqual(expectedConcert);
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

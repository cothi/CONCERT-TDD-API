import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Seat, SeatStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { SeatRepository } from 'src/infrastructure/database/repositories/concerts/seat.repository';
import { CreateSeatsModel } from '../../model/seat.model';
import { SeatService } from '../seat.service';

describe('SeatService', () => {
  let seatService: SeatService;
  let seatRepository: jest.Mocked<SeatRepository>;

  beforeEach(async () => {
    const mockSeatRepository = {
      createMany: jest.fn(),
      findByConcertDateId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeatService,
        { provide: SeatRepository, useValue: mockSeatRepository },
      ],
    }).compile();

    seatService = module.get<SeatService>(SeatService);
    seatRepository = module.get(SeatRepository);
  });

  it('좌석을 성공적으로 생성한다', async () => {
    const createSeatModel: CreateSeatsModel = {
      concertDateId: 'concert-date-1',
      seatNumber: 5,
      price: new Decimal(100),
      status: SeatStatus.AVAILABLE,
    };

    const expectedResult: Prisma.BatchPayload = { count: 5 };
    const seats: Seat[] = [];

    seatRepository.findByConcertDateId.mockResolvedValue(seats);
    seatRepository.createMany.mockResolvedValue(expectedResult);
    const result = await seatService.createSeat(createSeatModel);

    expect(seatRepository.createMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          concertDateId: 'concert-date-1',
          seatNumber: expect.any(Number),
          status: SeatStatus.AVAILABLE,
          price: new Decimal(100),
        }),
      ]),
    );
    expect(result).toEqual(expectedResult);
  });

  it('콘서트 날짜 ID로 좌석을 조회한다', async () => {
    // getSeatsByConcertDateId 메서드 구현 후 테스트 작성
  });

  it('좌석 ID로 특정 좌석을 조회한다', async () => {
    // getSeatById 메서드 구현 후 테스트 작성
  });

  it('좌석을 성공적으로 예약한다', async () => {
    // reserveSeat 메서드 구현 후 테스트 작성
  });

  it('좌석 예약을 성공적으로 취소한다', async () => {
    // cancelSeat 메서드 구현 후 테스트 작성
  });

  it('좌석 번호를 올바르게 생성한다', () => {});
});

import { Decimal } from '@prisma/client/runtime/library';
import { Test, TestingModule } from '@nestjs/testing';
import { SeatRepository } from 'src/infrastructure/database/repositories/concerts/seat.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Seat, SeatStatus } from '@prisma/client';
import { SeatService } from '../seat.service';
import { CreateSeatsModel } from '../../model/seat.model';

describe('SeatService', () => {
  let seatService: SeatService;
  let seatRepository: jest.Mocked<SeatRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeatService,
        {
          provide: SeatRepository,
          useFactory: () => ({
            findByConcertDateId: jest.fn(),
            createMany: jest.fn(),
            findAndLockById: jest.fn(),
            findBySeatId: jest.fn(),
            updateStatus: jest.fn(),
          }),
        },
      ],
    }).compile();

    seatService = module.get<SeatService>(SeatService);
    seatRepository = module.get(SeatRepository);
  });

  describe('createSeat', () => {
    it('공연 날짜에 좌석이 없을 때 새로운 좌석을 생성해야 한다', async () => {
      // given
      const createSeatModel: CreateSeatsModel = {
        concertDateId: '1',
        seatNumber: 5,
        status: SeatStatus.AVAILABLE,
        price: new Decimal(100),
      };
      seatRepository.findByConcertDateId.mockResolvedValue([]);
      seatRepository.createMany.mockResolvedValue({ count: 5 });

      // when
      const result = await seatService.createSeat(createSeatModel);

      // then
      expect(result).toEqual({ count: 5 });
      expect(seatRepository.createMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ concertDateId: '1', seatNumber: 1 }),
          expect.objectContaining({ concertDateId: '1', seatNumber: 5 }),
        ]),
      );
    });

    it('이미 좌석이 존재할 경우 HttpException을 발생시켜야 한다', async () => {
      // given
      const createSeatModel = {
        concertDateId: '1',
        seatNumber: 5,
        status: SeatStatus.AVAILABLE,
        price: new Decimal(100),
      };
      seatRepository.findByConcertDateId.mockResolvedValue([{} as Seat]);

      // when & then
      await expect(seatService.createSeat(createSeatModel)).rejects.toThrow(
        new HttpException('이미 시트가 생성되었습니다.', HttpStatus.CONFLICT),
      );
    });
  });

  describe('findAndLockSeat', () => {
    it('존재하는 좌석을 찾아 잠금 처리해야 한다', async () => {
      // given
      const seatId = '1';
      const mockSeat = { id: seatId } as Seat;
      seatRepository.findAndLockById.mockResolvedValue(mockSeat);

      // when
      const result = await seatService.findAndLockSeat(seatId);

      // then
      expect(result).toEqual(mockSeat);
    });
  });

  describe('updateSeatStatus', () => {
    it('존재하는 좌석의 상태를 성공적으로 업데이트해야 한다', async () => {
      // given
      const updateModel = { seatId: '1', status: SeatStatus.RESERVED };
      const mockSeat = { id: '1', status: SeatStatus.AVAILABLE } as Seat;
      seatRepository.findBySeatId.mockResolvedValue(mockSeat);
      seatRepository.updateStatus.mockResolvedValue({
        ...mockSeat,
        status: 'RESERVED',
      });

      // when
      const result = await seatService.updateSeatStatus(updateModel);

      // then
      expect(result).toEqual(
        expect.objectContaining({ id: '1', status: 'RESERVED' }),
      );
    });

    it('존재하지 않는 좌석에 대해 상태 업데이트 시 HttpException을 발생시켜야 한다', async () => {
      // given
      const updateModel = { seatId: '1', status: SeatStatus.RESERVED };
      seatRepository.findBySeatId.mockResolvedValue(null);

      // when & then
      await expect(seatService.updateSeatStatus(updateModel)).rejects.toThrow(
        new HttpException(
          '요청한 좌석이 존재하지 않습니다',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  // 추가 메서드에 대한 테스트도 이와 같은 패턴으로 작성할 수 있습니다.
});

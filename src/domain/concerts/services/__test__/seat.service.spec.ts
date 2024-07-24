import { Test, TestingModule } from '@nestjs/testing';
import { SeatRepository } from 'src/infrastructure/concerts/repositories/seat.repository';

import { Prisma, SeatStatus } from '@prisma/client';
import { SeatService } from '../seat.service';
import {
  CreateSeatsModel,
  GetSeatByConcertDateIdModel,
  GetSeatBySeatIdModel,
  SeatModel,
  UpdateSeatStatusModel,
} from '../../model/seat.model';
import { HttpException } from '@nestjs/common';

describe('SeatService', () => {
  let service: SeatService;
  let repository: jest.Mocked<SeatRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findByConcertDateId: jest.fn(),
      createMany: jest.fn(),
      findAndLockById: jest.fn(),
      findBySeatId: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeatService,
        { provide: SeatRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<SeatService>(SeatService);
    repository = module.get(SeatRepository);
  });

  it('좌석을 생성해야 한다', async () => {
    const model = new CreateSeatsModel();
    model.concertDateId = 'concert1';
    model.seatNumber = 10;
    model.status = SeatStatus.AVAILABLE;
    model.price = new Prisma.Decimal(100);

    repository.findByConcertDateId.mockResolvedValue([]);
    repository.createMany.mockResolvedValue({ count: 10 });

    const result = await service.createSeat(model);

    expect(repository.findByConcertDateId).toHaveBeenCalled();
    expect(repository.createMany).toHaveBeenCalled();
    expect(result.count).toBe(10);
  });

  it('이미 좌석이 존재할 경우 예외를 던져야 한다', async () => {
    const model = new CreateSeatsModel();
    model.concertDateId = 'concert1';

    repository.findByConcertDateId.mockResolvedValue([new SeatModel()]);

    await expect(service.createSeat(model)).rejects.toThrow(HttpException);
  });

  it('좌석을 찾고 락을 걸어야 한다', async () => {
    const model = new GetSeatBySeatIdModel();
    model.seatId = 'seat1';

    const expectedSeat = new SeatModel();
    repository.findAndLockById.mockResolvedValue(expectedSeat);

    const result = await service.findAndLockSeat(model);

    expect(repository.findAndLockById).toHaveBeenCalledWith(model, undefined);
    expect(result).toBe(expectedSeat);
  });

  it('좌석 상태를 업데이트해야 한다', async () => {
    const model = new UpdateSeatStatusModel();
    model.seatId = 'seat1';
    model.status = SeatStatus.RESERVED;

    const expectedSeat = new SeatModel();
    repository.findBySeatId.mockResolvedValue(new SeatModel());
    repository.updateStatus.mockResolvedValue(expectedSeat);

    const result = await service.updateSeatStatus(model);

    expect(repository.findBySeatId).toHaveBeenCalled();
    expect(repository.updateStatus).toHaveBeenCalledWith(model, undefined);
    expect(result).toBe(expectedSeat);
  });

  it('공연 날짜로 좌석을 조회해야 한다', async () => {
    const model = new GetSeatByConcertDateIdModel();
    model.concertDateId = 'concert1';

    const expectedSeats = [new SeatModel(), new SeatModel()];
    repository.findByConcertDateId.mockResolvedValue(expectedSeats);

    const result = await service.getSeatsByConcertDateId(model);

    expect(repository.findByConcertDateId).toHaveBeenCalledWith(
      model,
      undefined,
    );
    expect(result).toBe(expectedSeats);
  });

  it('좌석 ID로 좌석을 조회해야 한다', async () => {
    const model = new GetSeatBySeatIdModel();
    model.seatId = 'seat1';

    const expectedSeat = new SeatModel();
    repository.findBySeatId.mockResolvedValue(expectedSeat);

    const result = await service.getSeatBySeatId(model);

    expect(repository.findBySeatId).toHaveBeenCalledWith(model, undefined);
    expect(result).toBe(expectedSeat);
  });
});

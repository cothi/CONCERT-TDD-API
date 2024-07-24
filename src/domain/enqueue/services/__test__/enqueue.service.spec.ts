import { Test, TestingModule } from '@nestjs/testing';
import { QueueEntryRepository } from 'src/infrastructure/enqueue/repository/queue.repository';
import { QueueEntryStatus } from '@prisma/client';
import { QueueService } from '../enqueue.service';
import {
  CountWaitingAheadModel,
  CreateEnqueueModel,
  GetQueueEntryByUserIdModel,
  QueueModel,
} from '../../model/enqueue.model';
import { HttpException } from '@nestjs/common';

describe('QueueService', () => {
  let service: QueueService;
  let repository: jest.Mocked<QueueEntryRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findByUserId: jest.fn(),
      create: jest.fn(),
      countWaitingAhead: jest.fn(),
      countEligibleEntries: jest.fn(),
      findEligibleEntries: jest.fn(),
      findWaitingEntries: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        { provide: QueueEntryRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
    repository = module.get(QueueEntryRepository);
  });

  it('사용자를 대기열에 추가해야 한다', async () => {
    const model = new CreateEnqueueModel();
    model.userId = 'user1';

    repository.findByUserId.mockResolvedValue({
      status: QueueEntryStatus.EXPIRED,
    } as QueueModel);
    repository.create.mockResolvedValue({ id: 'queue1' } as QueueModel);

    const result = await service.enqueue(model);

    expect(repository.findByUserId).toHaveBeenCalledWith(
      expect.any(GetQueueEntryByUserIdModel),
      undefined,
    );
    expect(repository.create).toHaveBeenCalledWith(model, undefined);
    expect(result).toEqual({ id: 'queue1' });
  });

  it('이미 대기 중인 사용자는 예외를 던져야 한다', async () => {
    const model = new CreateEnqueueModel();
    model.userId = 'user1';

    repository.findByUserId.mockResolvedValue({
      status: QueueEntryStatus.WAITING,
    } as QueueModel);

    await expect(service.enqueue(model)).rejects.toThrow(HttpException);
  });

  it('사용자의 대기열 항목을 조회해야 한다', async () => {
    const model = GetQueueEntryByUserIdModel.create('user1');

    repository.findByUserId.mockResolvedValue({ id: 'queue1' } as QueueModel);

    const result = await service.getQueueEntryByUserId(model);

    expect(repository.findByUserId).toHaveBeenCalledWith(model, undefined);
    expect(result).toEqual({ id: 'queue1' });
  });

  it('대기열에 없는 사용자 조회 시 예외를 던져야 한다', async () => {
    const model = GetQueueEntryByUserIdModel.create('user1');

    repository.findByUserId.mockResolvedValue(null);

    await expect(service.getQueueEntryByUserId(model)).rejects.toThrow(
      HttpException,
    );
  });

  it('대기 중인 항목의 수를 반환해야 한다', async () => {
    const model = new CountWaitingAheadModel();
    model.enteredAt = new Date();

    repository.countWaitingAhead.mockResolvedValue(5);

    const result = await service.getQueuedAhead(model);

    expect(repository.countWaitingAhead).toHaveBeenCalledWith(model, undefined);
    expect(result).toBe(5);
  });

  it('예약 가능 여부를 확인해야 한다', async () => {
    repository.countEligibleEntries.mockResolvedValue(2);

    const result = await service.isEligibleForReservation(
      QueueEntryStatus.WAITING,
    );

    expect(repository.countEligibleEntries).toHaveBeenCalledWith(undefined);
    expect(result).toBe(true);
  });
});

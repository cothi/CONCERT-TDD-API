// src/application/services/__tests__/queue.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { QueueEntry, QueueEntryStatus } from '@prisma/client';
import { QueueService } from '../enqueue.service';
import { QueueEntryRepository } from 'src/infrastructure/database/repositories/enqueue/queue.repository';

// QueueEntryRepository 모킹
const mockQueueEntryRepository = {
  create: jest.fn(),
  findByUserId: jest.fn(),
  countWaitingAhead: jest.fn(),
  countEligibleEntries: jest.fn(),
  findEligibleEntries: jest.fn(),
  removeById: jest.fn(),
  findWaitingEntries: jest.fn(),
  updateStatus: jest.fn(),
};

describe('QueueService', () => {
  let service: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: QueueEntryRepository,
          useValue: mockQueueEntryRepository,
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  // 각 테스트 후 모든 모의 함수 초기화
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('사용자를 대기열에 추가해야 한다', async () => {
    const userId = 'test-user-id';
    const mockQueueEntry: QueueEntry = {
      id: 'test-queue-entry-id',
      userId,
      status: QueueEntryStatus.WAITING,
      enteredAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };

    mockQueueEntryRepository.create.mockResolvedValue(mockQueueEntry);

    const result = await service.enqueue(userId);

    expect(mockQueueEntryRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        user: { connect: { id: userId } },
        status: QueueEntryStatus.WAITING,
      }),
    );
    expect(result).toEqual(mockQueueEntry);
  });

  it('사용자의 대기열 항목을 조회해야 한다', async () => {
    const userId = 'test-user-id';
    const mockQueueEntry: QueueEntry = {
      id: 'test-queue-entry-id',
      userId,
      status: QueueEntryStatus.WAITING,
      enteredAt: new Date(),
      expiresAt: new Date(),
      updatedAt: new Date(),
    };

    mockQueueEntryRepository.findByUserId.mockResolvedValue(mockQueueEntry);

    const result = await service.getQueueEntry(userId);

    expect(mockQueueEntryRepository.findByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockQueueEntry);
  });

  it('대기 중인 항목의 수를 정확히 반환해야 한다', async () => {
    const enteredAt = new Date();
    const expectedCount = 5;

    mockQueueEntryRepository.countWaitingAhead.mockResolvedValue(expectedCount);

    const result = await service.getQueuedAhead(enteredAt);

    expect(mockQueueEntryRepository.countWaitingAhead).toHaveBeenCalledWith(
      enteredAt,
    );
    expect(result).toBe(expectedCount);
  });

  it('예약 가능 여부를 정확히 판단해야 한다', async () => {
    // ELIGIBLE 상태일 때
    expect(
      await service.isEligibleForReservation(QueueEntryStatus.ELIGIBLE),
    ).toBe(true);

    // WAITING 상태이고 예약 가능한 슬롯이 있을 때
    mockQueueEntryRepository.countEligibleEntries.mockResolvedValue(4);
    expect(
      await service.isEligibleForReservation(QueueEntryStatus.WAITING),
    ).toBe(true);

    // WAITING 상태이지만 예약 가능한 슬롯이 없을 때
    mockQueueEntryRepository.countEligibleEntries.mockResolvedValue(5);
    expect(
      await service.isEligibleForReservation(QueueEntryStatus.WAITING),
    ).toBe(false);
  });

  it('대기열 항목들의 상태를 올바르게 업데이트해야 한다', async () => {
    const mockEligibleEntries: QueueEntry[] = [
      {
        id: 'expired-entry-id',
        userId: 'user1',
        status: QueueEntryStatus.ELIGIBLE,
        enteredAt: new Date(),
        expiresAt: new Date(Date.now() - 1000), // 만료된 항목
        updatedAt: new Date(),
      },
    ];

    const mockWaitingEntries: QueueEntry[] = [
      {
        id: 'waiting-entry-id',
        userId: 'user2',
        status: QueueEntryStatus.WAITING,
        enteredAt: new Date(),
        expiresAt: new Date(Date.now() + 1000),
        updatedAt: new Date(),
      },
    ];

    mockQueueEntryRepository.findEligibleEntries.mockResolvedValue(
      mockEligibleEntries,
    );
    mockQueueEntryRepository.countEligibleEntries.mockResolvedValue(0);
    mockQueueEntryRepository.findWaitingEntries.mockResolvedValue(
      mockWaitingEntries,
    );

    await service.updateQueueEntries();

    expect(mockQueueEntryRepository.removeById).toHaveBeenCalledWith(
      'expired-entry-id',
    );
    expect(mockQueueEntryRepository.updateStatus).toHaveBeenCalledWith(
      'waiting-entry-id',
      QueueEntryStatus.ELIGIBLE,
      expect.any(Object),
    );
  });
});

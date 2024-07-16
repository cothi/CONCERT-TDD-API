import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { QueueEntry, QueueEntryStatus } from '@prisma/client';
import { QUEUE_CONFIG } from 'src/common/config/config';
import { QueueEntryRepository } from 'src/infrastructure/database/repositories/enqueue/queue.repository';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';

@Injectable()
export class QueueService {
  constructor(private queueEntryRepository: QueueEntryRepository) {}

  /**
   * 사용자를 대기열에 추가합니다.
   * @param userId 사용자 ID
   * @returns 생성된 대기열 항목
   */
  async enqueue(userId: string, tx?: PrismaTransaction): Promise<QueueEntry> {
    const queueEntry = await this.queueEntryRepository.findByUserId(userId);
    if (queueEntry) {
      throw new HttpException(
        '이미 대기열 안에 존재합니다.',
        HttpStatus.CONFLICT,
      );
    }

    return await this.queueEntryRepository.create(
      {
        status: QueueEntryStatus.WAITING,
        enteredAt: new Date(),
        user: { connect: { id: userId } },
      },
      tx,
    );
  }

  /**
   * 특정 사용자의 대기열 항목을 조회합니다.
   * @param userId 사용자 ID
   * @returns 대기열 항목
   */
  async getQueueEntry(
    userId: string,
    tx?: PrismaTransaction,
  ): Promise<QueueEntry> {
    const queueEntry = await this.queueEntryRepository.findByUserId(userId, tx);
    if (!queueEntry) {
      throw new HttpException(
        '대기열안에 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return queueEntry;
  }

  /**
   * 주어진 시간 이전에 대기 중인 항목의 수를 반환합니다.
   * @param enteredAt 기준 시간
   * @returns 대기 중인 항목의 수
   */
  async getQueuedAhead(
    enteredAt: Date,
    tx?: PrismaTransaction,
  ): Promise<number> {
    return await this.queueEntryRepository.countWaitingAhead(enteredAt, tx);
  }

  /**
   * 주어진 상태가 예약 가능한 상태인지 확인합니다.
   * @param status 대기열 항목 상태
   * @returns 예약 가능 여부
   */
  async isEligibleForReservation(
    status: QueueEntryStatus,
    tx?: PrismaTransaction,
  ): Promise<boolean> {
    if (status === QueueEntryStatus.ELIGIBLE) return true;
    const eligibleCount =
      await this.queueEntryRepository.countEligibleEntries();
    return (
      status === QueueEntryStatus.WAITING &&
      eligibleCount < QUEUE_CONFIG.MAX_ELIGIBLE_ENTRIES
    );
  }

  /**
   * 대기열 항목들의 상태를 업데이트합니다.
   * 만료된 항목을 만료시키고, 새로운 항목을 예약 가능 상태로 변경합니다.
   */
  async updateQueueEntries(): Promise<void> {
    // 예약 가능한 항목들을 조회합니다.
    const eligibleEntries =
      await this.queueEntryRepository.findEligibleEntries();

    // 만료된 항목들을 제거합니다.
    for (const entry of eligibleEntries) {
      if (entry.expiresAt < new Date()) {
        await this.queueEntryRepository.updateStatus(
          entry.id,
          QueueEntryStatus.EXPIRED,
        );
      }
    }

    // 남아있는 예약 가능한 항목의 수를 계산합니다.
    const remainingEligibleCount =
      await this.queueEntryRepository.countEligibleEntries();
    const availableSlots =
      QUEUE_CONFIG.MAX_ELIGIBLE_ENTRIES - remainingEligibleCount;

    // 새로운 항목들을 예약 가능 상태로 변경합니다.
    if (availableSlots > 0) {
      const waitingEntries =
        await this.queueEntryRepository.findWaitingEntries(availableSlots);
      for (const entry of waitingEntries) {
        await this.queueEntryRepository.updateStatus(
          entry.id,
          QueueEntryStatus.ELIGIBLE,
          {
            expiresAt: new Date(Date.now() + QUEUE_CONFIG.EXPIRATION_TIME_MS), // 현재로부터 5분 후QUEUE_CONFIG
          },
        );
      }
    }
  }
}

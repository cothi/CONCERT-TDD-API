import { Injectable } from '@nestjs/common';
import { QueueEntry, QueueEntryStatus } from '@prisma/client';
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
    return this.queueEntryRepository.create(
      {
        status: QueueEntryStatus.WAITING,
        enteredAt: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 현재로부터 24시간 후
        user: { connect: { id: userId } },
      },
      tx,
    );
  }

  /**
   * 특정 사용자의 대기열 항목을 조회하고 락을 겁니다.
   * @param userId 조회할 사용자 ID
   * @param tx 트랜잭션 객체 (선택적)
   * @returns 사용자의 대기열 항목 또는 null
   **/
  async getQueueEntryWithLock(useId: string, tx?: PrismaTransaction) {
    return await this.queueEntryRepository.findByUserIdWithLock(useId, tx);
  }

  /**
   * 특정 사용자의 대기열 항목을 조회합니다.
   * @param userId 사용자 ID
   * @returns 대기열 항목 또는 null
   */
  async getQueueEntry(
    userId: string,
    tx?: PrismaTransaction,
  ): Promise<QueueEntry | null> {
    return this.queueEntryRepository.findByUserId(userId);
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
    return this.queueEntryRepository.countWaitingAhead(enteredAt);
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
    return status === QueueEntryStatus.WAITING && eligibleCount < 5;
  }

  /**
   * 대기열 항목들의 상태를 업데이트합니다.
   * 만료된 항목을 제거하고, 새로운 항목을 예약 가능 상태로 변경합니다.
   */
  async updateQueueEntries(): Promise<void> {
    // 예약 가능한 항목들을 조회합니다.
    const eligibleEntries =
      await this.queueEntryRepository.findEligibleEntries();

    // 만료된 항목들을 제거합니다.
    for (const entry of eligibleEntries) {
      if (entry.expiresAt < new Date()) {
        await this.queueEntryRepository.removeById(entry.id);
      }
    }

    // 남아있는 예약 가능한 항목의 수를 계산합니다.
    const remainingEligibleCount =
      await this.queueEntryRepository.countEligibleEntries();
    const availableSlots = 5 - remainingEligibleCount;

    // 새로운 항목들을 예약 가능 상태로 변경합니다.
    if (availableSlots > 0) {
      const waitingEntries =
        await this.queueEntryRepository.findWaitingEntries(availableSlots);
      for (const entry of waitingEntries) {
        await this.queueEntryRepository.updateStatus(
          entry.id,
          QueueEntryStatus.ELIGIBLE,
          {
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 현재로부터 5분 후
          },
        );
      }
    }
  }
}

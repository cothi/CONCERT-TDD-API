import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { QueueEntry, Prisma, QueueEntryStatus } from '@prisma/client';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';

@Injectable()
export class QueueEntryRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 새로운 대기열 항목을 생성합니다.
   * @param data 생성할 대기열 항목 데이터
   * @returns 생성된 대기열 항목
   */
  async create(
    data: Prisma.QueueEntryCreateInput,
    tx?: PrismaTransaction,
  ): Promise<QueueEntry> {
    return (tx ?? this.prisma).queueEntry.create({ data });
  }

  /**
   * 특정 사용자의 대기열 항목을 조회합니다.
   * @param userId 조회할 사용자 ID
   * @returns 사용자의 대기열 항목 또는 null
   */
  async findByUserId(
    userId: string,
    tx?: PrismaTransaction,
  ): Promise<QueueEntry | null> {
    return (tx ?? this.prisma).queueEntry.findUnique({ where: { userId } });
  }

  /**
   * 예약 가능한 상태의 대기열 항목들을 조회합니다.
   * @returns 예약 가능한 대기열 항목 배열 (최대 5개)
   */
  async findEligibleEntries(tx?: PrismaTransaction): Promise<QueueEntry[]> {
    return (tx ?? this.prisma).queueEntry.findMany({
      where: { status: QueueEntryStatus.ELIGIBLE },
      orderBy: { enteredAt: 'asc' },
      take: 5,
    });
  }

  /**
   * 대기 중인 항목들을 조회합니다.
   * @param limit 조회할 최대 항목 수
   * @returns 대기 중인 대기열 항목 배열
   */
  async findWaitingEntries(
    limit: number,
    tx?: PrismaTransaction,
  ): Promise<QueueEntry[]> {
    return (tx ?? this.prisma).queueEntry.findMany({
      where: { status: QueueEntryStatus.WAITING },
      orderBy: { enteredAt: 'asc' },
      take: limit,
    });
  }

  /**
   * 대기열 항목의 상태를 업데이트합니다.
   * @param id 업데이트할 대기열 항목 ID
   * @param status 새로운 상태
   * @param data 추가로 업데이트할 데이터 (선택적)
   * @returns 업데이트된 대기열 항목
   */
  async updateStatus(
    id: string,
    status: QueueEntryStatus,
    data?: Partial<QueueEntry>,
    tx?: PrismaTransaction,
  ): Promise<QueueEntry> {
    return (tx ?? this.prisma).queueEntry.update({
      where: { id },
      data: { status, ...data },
    });
  }

  /**
   * 특정 대기열 항목을 삭제합니다.
   * @param id 삭제할 대기열 항목 ID
   */
  async removeById(id: string, tx?: PrismaTransaction): Promise<void> {
    await (tx ?? this.prisma).queueEntry.delete({ where: { id } });
  }

  /**
   * 특정 시간 이전에 대기 중인 항목 수를 계산합니다.
   * @param enteredAt 기준 시간
   * @returns 기준 시간 이전에 대기 중인 항목 수
   */
  async countWaitingAhead(
    enteredAt: Date,
    tx?: PrismaTransaction,
  ): Promise<number> {
    return (tx ?? this.prisma).queueEntry.count({
      where: {
        status: QueueEntryStatus.WAITING,
        enteredAt: { lt: enteredAt },
      },
    });
  }

  /**
   * 예약 가능한 상태의 대기열 항목 수를 계산합니다.
   * @returns 예약 가능한 대기열 항목 수
   */
  async countEligibleEntries(tx?: PrismaTransaction): Promise<number> {
    return (tx ?? this.prisma).queueEntry.count({
      where: { status: QueueEntryStatus.ELIGIBLE },
    });
  }
}

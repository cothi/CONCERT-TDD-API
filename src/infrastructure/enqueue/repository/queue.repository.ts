import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { QueueEntry, QueueEntryStatus } from '@prisma/client';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import {
  CountWaitingAheadModel,
  CreateEnqueueModel,
  GetQueueEntryByUserIdModel,
  GetWaitingEntriesModel,
  QueueModel,
  RemoveQueueByIdModel,
  UpdateQueueStatusModel,
} from 'src/domain/enqueue/model/enqueue.model';
import { QueueMapper } from '../mapper/queue.mapper';

@Injectable()
export class QueueEntryRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 새로운 대기열 항목을 생성합니다.
   * @param data 생성할 대기열 항목 데이터
   * @returns 생성된 대기열 항목
   */
  async create(
    model: CreateEnqueueModel,
    tx?: PrismaTransaction,
  ): Promise<QueueModel> {
    const entity = QueueMapper.toMapCreateQueueEntiry(model);
    const queue = await (tx ?? this.prisma).queueEntry.upsert({
      where: { userId: entity.userId },
      update: {
        status: QueueEntryStatus.WAITING,
        enteredAt: new Date(),
      },
      create: {
        userId: entity.userId,
        status: QueueEntryStatus.WAITING,
        enteredAt: new Date(),
      },
    });
    return QueueMapper.toMapQueueModel(queue);
  }

  /**
   * 특정 사용자의 대기열 항목을 조회합니다.
   * @param userId 조회할 사용자 ID
   * @returns 사용자의 대기열 항목 또는 null
   */
  async findByUserId(
    model: GetQueueEntryByUserIdModel,
    tx?: PrismaTransaction,
  ): Promise<QueueModel | null> {
    const entity = QueueMapper.toMapGetQueueByUserIdEntity(model);
    const queue = await (tx ?? this.prisma).queueEntry.findUnique({
      where: { userId: entity.userId },
    });
    return QueueMapper.toMapQueueModel(queue);
  }

  /**
   * 대기열 항목의 상태를 업데이트합니다.
   * @param id 업데이트할 대기열 항목 ID
   * @param status 새로운 상태
   * @param data 추가로 업데이트할 데이터 (선택적)
   * @returns 업데이트된 대기열 항목
   */
  async updateStatus(
    model: UpdateQueueStatusModel,
    tx?: PrismaTransaction,
    data?: Partial<QueueEntry>,
  ): Promise<QueueModel> {
    const entity = QueueMapper.toMapUpdateStatusEntity(model);
    const queue = await (tx ?? this.prisma).queueEntry.update({
      where: { id: entity.id },
      data: { status: entity.status, ...data },
    });
    return QueueMapper.toMapQueueModel(queue);
  }

  /**
   * 대기 중인 항목들을 조회합니다.
   * @param limit 조회할 최대 항목 수
   * @returns 대기 중인 대기열 항목 배열
   */
  async findWaitingEntries(
    model: GetWaitingEntriesModel,
    tx?: PrismaTransaction,
  ): Promise<QueueModel[]> {
    const entity = QueueMapper.toMapGetWaitingQueueByLimitEntity(model);
    const queues = await (tx ?? this.prisma).queueEntry.findMany({
      where: { status: QueueEntryStatus.WAITING },
      orderBy: { enteredAt: 'asc' },
      take: entity.limit,
    });
    return QueueMapper.toMapQueueModels(queues);
  }

  /**
   * 특정 대기열 항목을 삭제합니다.
   * @param id 삭제할 대기열 항목 ID
   */
  async removeById(
    model: RemoveQueueByIdModel,
    tx?: PrismaTransaction,
  ): Promise<QueueModel> {
    const entity = QueueMapper.toMapRemoveQueueByIdEntity(model);
    const queue = await (tx ?? this.prisma).queueEntry.delete({
      where: { id: entity.id },
    });
    return QueueMapper.toMapQueueModel(queue);
  }

  /**
   * 특정 시간 이전에 대기 중인 항목 수를 계산합니다.
   * @param enteredAt 기준 시간
   * @returns 기준 시간 이전에 대기 중인 항목 수
   */
  async countWaitingAhead(
    model: CountWaitingAheadModel,
    tx?: PrismaTransaction,
  ): Promise<number> {
    const entity = QueueMapper.toMapCountWaitingAheadEntity(model);
    const count = (tx ?? this.prisma).queueEntry.count({
      where: {
        status: QueueEntryStatus.WAITING,
        enteredAt: { lt: entity.enteredAt },
      },
    });
    return count;
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
}

import { Inject, Injectable } from '@nestjs/common';
import { RecordPaymentEntity } from 'src/domain/points/entity/record.payment.entity';
import { PointTransactionRepository } from 'src/infrastructure/points/point-transaction.repository';
import { RecordPaymentModel } from '../model/point.model';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';

@Injectable()
export class PointTransactionService {
  constructor(
    @Inject(PointTransactionRepository)
    private readonly pointTransactionRepository: PointTransactionRepository,
  ) {}
  async getPaymentHistory(userId: string, tx?: PrismaTransaction) {
    return await this.pointTransactionRepository.getPointHistory(userId, tx);
  }
  async recordPaymentHistory(
    recordPaymentModel: RecordPaymentModel,
    tx?: PrismaTransaction,
  ) {
    const recordPaymentEntity = RecordPaymentEntity.create(
      recordPaymentModel.userId,
      recordPaymentModel.type,
      recordPaymentModel.amount,
    );
    return await this.pointTransactionRepository.recordPointHistory(
      recordPaymentEntity,
      tx,
    );
  }
}

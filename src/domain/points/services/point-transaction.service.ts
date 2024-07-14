import { Inject, Injectable } from '@nestjs/common';
import { RecordPaymentEntity } from 'src/domain/points/entity/record.payment.entity';
import { PointTransactionRepository } from 'src/infrastructure/database/repositories/points/point-transaction.repository';
import { RecordPaymentModel } from '../model/point.model';

@Injectable()
export class PointTransactionService {
  constructor(
    @Inject(PointTransactionRepository)
    private readonly pointTransactionRepository: PointTransactionRepository,
  ) {}
  async getPaymentHistory(userId: string) {
    return await this.pointTransactionRepository.getPointHistory(userId);
  }
  async recordPaymentHistory(recordPaymentModel: RecordPaymentModel) {
    const recordPaymentEntity = RecordPaymentEntity.create(
      recordPaymentModel.userId,
      recordPaymentModel.type,
      recordPaymentModel.amount,
    );
    return await this.pointTransactionRepository.recordPointHistory(
      recordPaymentEntity,
    );
  }
}

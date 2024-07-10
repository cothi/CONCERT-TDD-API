import { Inject, Injectable } from '@nestjs/common';
import { RecordPaymentDto } from '../dto/record-payment.dto';
import { RecordPaymentEntity } from 'src/domain/points/entity/record.payment.entity';
import { PointTransactionRepository } from 'src/infrastructure/database/repositories/points/point-transaction.repository';

@Injectable()
export class PointTransactionService {
  constructor(
    @Inject(PointTransactionRepository)
    private readonly pointTransactionRepository: PointTransactionRepository,
  ) {}
  async getPaymentHistory() {}
  async recordPaymentHistory(recordPaymentDto: RecordPaymentDto) {
    const recordPaymentEntity = RecordPaymentEntity.create(
      recordPaymentDto.userId,
      recordPaymentDto.transactionType,
      recordPaymentDto.amount,
    );
    return await this.pointTransactionRepository.recordPointHistory(
      recordPaymentEntity,
    );
  }
}

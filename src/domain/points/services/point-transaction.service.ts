import { Injectable } from '@nestjs/common';
import { PointTransactionRepository } from 'src/infrastructure/points/repository/point-payment.repository';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import {
  GetPaymentsByUserIdModel,
  RecordPaymentModel,
} from '../model/payment.model';

@Injectable()
export class PointTransactionService {
  constructor(
    private readonly pointTransactionRepository: PointTransactionRepository,
  ) {}
  async getPaymentHistory(
    model: GetPaymentsByUserIdModel,
    tx?: PrismaTransaction,
  ) {
    return await this.pointTransactionRepository.getPointHistory(model, tx);
  }
  async recordPaymentHistory(
    recordPaymentModel: RecordPaymentModel,
    tx?: PrismaTransaction,
  ) {
    return await this.pointTransactionRepository.recordPointHistory(
      recordPaymentModel,
      tx,
    );
  }
}

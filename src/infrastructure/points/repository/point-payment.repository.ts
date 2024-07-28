import { Injectable } from '@nestjs/common';
import {
  GetPaymentsByUserIdModel,
  RecordPaymentModel,
} from 'src/domain/points/model/payment.model';
import { PrismaTransaction } from 'src/infrastructure/database/prisma/types/prisma.types';
import { PrismaService } from '../../database/prisma/prisma.service';
import { PointPaymentMapper } from '../mapper/point-payment.mapper';

@Injectable()
export class PointTransactionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getPointHistory(
    model: GetPaymentsByUserIdModel,
    tx?: PrismaTransaction,
  ) {
    const entity = PointPaymentMapper.toMapGetPointHistoryByUserIdEntity(model);
    const payment = await (tx ?? this.prisma).payment.findMany({
      where: {
        userId: entity.userId,
      },
    });
    return PointPaymentMapper.toMapPaymentModels(payment);
  }
  async recordPointHistory(model: RecordPaymentModel, tx?: PrismaTransaction) {
    const entity = PointPaymentMapper.toMapRecordPointHistoryEntity(model);
    const payment = await (tx ?? this.prisma).payment.create({
      data: {
        userId: entity.userId,
        paymentType: entity.paymentType,
        amount: entity.amount,
      },
    });
    return PointPaymentMapper.toMapPaymentModel(payment);
  }
}

import { PrismaService } from '../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { RecordPaymentEntity } from '../../../../domain/points/entity/record.payment.entity';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';

@Injectable()
export class PointTransactionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getPointHistory(userId: string, tx?: PrismaTransaction) {
    return await (tx ?? this.prisma).payment.findMany({
      where: {
        userId,
      },
    });
  }
  async recordPointHistory(
    recordPaymentEntity: RecordPaymentEntity,
    tx?: PrismaTransaction,
  ) {
    return await (tx ?? this.prisma).payment.create({
      data: {
        userId: recordPaymentEntity.userId,
        paymentType: recordPaymentEntity.paymentType,
        amount: recordPaymentEntity.amount,
      },
    });
  }
}

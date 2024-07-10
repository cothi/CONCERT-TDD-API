import { PrismaService } from '../../prisma.service';
import { Injectable } from '@nestjs/common';
import { RecordPaymentEntity } from '../../../../domain/points/entity/record.payment.entity';

@Injectable()
export class PointTransactionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getPointHistory(userId: string) {
    return await this.prisma.payment.findMany({
      where: {
        userId,
      },
    });
  }
  async recordPointHistory(recordPaymentEntity: RecordPaymentEntity) {
    return await this.prisma.payment.create({
      data: {
        userId: recordPaymentEntity.userId,
        type: recordPaymentEntity.paymentType,
        amount: recordPaymentEntity.amount,
      },
    });
  }
}

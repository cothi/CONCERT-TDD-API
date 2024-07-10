import { ChargePointEntity } from 'src/domain/points/entity/charge-point.entity';
import { PrismaService } from '../../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PointWalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async chargePoints(chargePointEntity: ChargePointEntity) {
    const payment = await this.prisma.userPoint.upsert({
      where: {
        userId: chargePointEntity.userId,
      },
      update: { amount: { increment: chargePointEntity.chargeAmount } },
      create: {
        userId: chargePointEntity.userId,
        amount: chargePointEntity.chargeAmount,
      },
    });

    return payment;
  }

  async deductPoints() {}

  async getBalance() {}
}

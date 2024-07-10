import { ChargePointEntity } from 'src/domain/points/entity/charge-point.entity';
import { PrismaService } from '../../prisma.service';
import { Injectable } from '@nestjs/common';
import { GetPointEntity } from 'src/domain/points/entity/get-point.entity';
import { Decimal } from '@prisma/client/runtime/library';

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

  async getBalance(getPointEntity: GetPointEntity) {
    const userPoint = await this.prisma.userPoint.findUnique({
      where: {
        userId: getPointEntity.userId,
      },
    });

    return userPoint ? userPoint.amount : new Decimal(0);
  }
}

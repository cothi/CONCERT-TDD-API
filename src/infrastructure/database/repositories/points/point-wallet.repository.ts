import { ChargePointEntity } from 'src/domain/points/entity/charge-point.entity';
import { PrismaService } from '../../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GetPointEntity } from 'src/domain/points/entity/get-point.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import { UserPoint } from '@prisma/client';

@Injectable()
export class PointWalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async chargePoints(
    chargePointEntity: ChargePointEntity,
    tx?: PrismaTransaction,
  ) {
    return await (tx ?? this.prisma).userPoint.upsert({
      where: {
        userId: chargePointEntity.userId,
      },
      update: { amount: { increment: chargePointEntity.chargeAmount } },
      create: {
        userId: chargePointEntity.userId,
        amount: chargePointEntity.chargeAmount,
      },
    });
  }

  async deductPoints(useId: string, point: Decimal, tx?: PrismaTransaction) {
    return await (tx ?? this.prisma).userPoint.update({
      where: {
        userId: useId,
      },
      data: {
        amount: {
          decrement: point,
        },
      },
    });
  }

  async getBalance(
    getPointEntity: GetPointEntity,
    tx?: PrismaTransaction,
  ): Promise<UserPoint | null> {
    return await (tx ?? this.prisma).userPoint.findUnique({
      where: {
        userId: getPointEntity.userId,
      },
    });
  }
}

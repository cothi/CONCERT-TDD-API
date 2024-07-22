import { Injectable } from '@nestjs/common';
import {
  ChargePointModel,
  DeductPointModel,
  GetPointByUserIdModel,
  PointWalletModel,
} from 'src/domain/points/model/point-wallet.model';

import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import { PrismaService } from '../../prisma/prisma.service';
import { PointWalletMapper } from '../mapper/point-wallet.mapper';

@Injectable()
export class PointWalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async chargePoints(
    model: ChargePointModel,
    tx?: PrismaTransaction,
  ): Promise<PointWalletModel> {
    const entity = PointWalletMapper.toMapChargePointEntity(model);
    const point = await (tx ?? this.prisma).userPoint.upsert({
      where: {
        userId: entity.userId,
      },
      update: { amount: { increment: entity.chargeAmount } },
      create: {
        userId: entity.userId,
        amount: entity.chargeAmount,
      },
    });
    return PointWalletMapper.toMapPointModel(point);
  }

  async deductPoints(
    model: DeductPointModel,
    tx?: PrismaTransaction,
  ): Promise<PointWalletModel> {
    const entity = PointWalletMapper.toMapDeductPointEntity(model);
    const point = await (tx ?? this.prisma).userPoint.update({
      where: {
        userId: entity.userId,
      },
      data: {
        amount: {
          decrement: entity.usedAmount,
        },
      },
    });
    return PointWalletMapper.toMapPointModel(point);
  }

  async getBalanceByUserId(
    model: GetPointByUserIdModel,
    tx?: PrismaTransaction,
  ): Promise<PointWalletModel | null> {
    const entity = PointWalletMapper.toMapGetBalanceByUserIdEntity(model);
    const point = await (tx ?? this.prisma).userPoint.findUnique({
      where: {
        userId: entity.userId,
      },
    });
    return PointWalletMapper.toMapPointModel(point);
  }
}

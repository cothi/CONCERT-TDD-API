import { Inject, Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { ErrorFactory } from 'src/common/errors/error-factory.error';
import { PrismaTransaction } from 'src/infrastructure/database/prisma/types/prisma.types';
import { PointWalletRepository } from '../../../infrastructure/points/repository/point-wallet.repository';
import {
  ChargePointModel,
  DeductPointModel,
  GetPointByUserIdModel,
  PointWalletModel,
} from '../model/point-wallet.model';
import { CacheService } from 'src/common/cache/cache.service';

@Injectable()
export class PointWalletService {
  constructor(
    @Inject(PointWalletRepository)
    private readonly pointWalletRepository: PointWalletRepository,
    private readonly cacheService: CacheService,
  ) {}

  async chargePoints(
    model: ChargePointModel,
    tx?: PrismaTransaction,
  ): Promise<PointWalletModel> {
    const key = `user:point:${model.userId}`;
    const point = await this.cacheService.get<PointWalletModel>(key);
    if (point) {
      await this.cacheService.del(key);
    }
    return await this.pointWalletRepository.chargePoints(model, tx);
  }

  async getBalance(model: GetPointByUserIdModel, tx?: PrismaTransaction) {
    const key = `user:point:${model.userId}`;
    const point = await this.cacheService.get<PointWalletModel>(key);
    if (!point) {
      const userPoint = await this.pointWalletRepository.getBalanceByUserId(
        model,
        tx,
      );
      await this.cacheService.set<PointWalletModel>(
        key,
        userPoint,
        1000 * 60 * 60,
      );
      return userPoint?.amount ? userPoint.amount : new Decimal(0);
    }
    return point.amount;
  }
  async getBalanceByUserIdWithLock(
    model: GetPointByUserIdModel,
    tx?: PrismaTransaction,
  ) {
    const userPoint =
      await this.pointWalletRepository.getBalanceByUserIdWithLock(model, tx);
    if (!userPoint) {
      throw ErrorFactory.createException(ErrorCode.NOT_FOUND);
    }
    return userPoint?.amount ? userPoint.amount : new Decimal(0);
  }
  async createPointWallet(model: ChargePointModel, tx?: PrismaTransaction) {
    return await this.pointWalletRepository.createPointWallet(model, tx);
  }
  async deductPoints(model: DeductPointModel, tx?: PrismaTransaction) {
    const getModel = GetPointByUserIdModel.create(model.userId);
    const userPoint = await this.pointWalletRepository.getBalanceByUserId(
      getModel,
      tx,
    );
    const getPoint = userPoint?.amount ? userPoint.amount : new Decimal(0);

    if (getPoint < model.usedPoint) {
      throw ErrorFactory.createException(ErrorCode.INSUFFICIENT_FUNDS);
    }
    return this.pointWalletRepository.deductPoints(model, tx);
  }
}

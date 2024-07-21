import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ChargePointEntity } from 'src/domain/points/entity/charge-point.entity';
import { GetPointEntity } from 'src/domain/points/entity/get-point.entity';
import { PointWalletRepository } from '../../../infrastructure/points/point-wallet.repository';
import { ChargePointModel, GetPointModel } from '../model/point.model';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';

@Injectable()
export class PointWalletService {
  constructor(
    @Inject(PointWalletRepository)
    private readonly pointWalletRepository: PointWalletRepository,
  ) {}

  async chargePoints(
    chargePointModel: ChargePointModel,
    tx?: PrismaTransaction,
  ) {
    const chargePointEntity = new ChargePointEntity(
      chargePointModel.userId,
      chargePointModel.amount,
    );
    return await this.pointWalletRepository.chargePoints(chargePointEntity, tx);
  }

  async getBalance(getPointModel: GetPointModel, tx?: PrismaTransaction) {
    const getPointEntity = new GetPointEntity(getPointModel.userId);
    const userPoint = await this.pointWalletRepository.getBalance(
      getPointEntity,
      tx,
    );

    return userPoint?.amount ? userPoint.amount : new Decimal(0);
  }

  async deductPoints(userId: string, point: Decimal, tx?: PrismaTransaction) {
    const userPoint = await this.pointWalletRepository.getBalance(
      GetPointEntity.create(userId),
    );
    const getPoint = userPoint?.amount ? userPoint.amount : new Decimal(0);

    if (getPoint < point) {
      throw new HttpException(
        '유저의 포인트가 부족합니다.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return this.pointWalletRepository.deductPoints(userId, point, tx);
  }
}

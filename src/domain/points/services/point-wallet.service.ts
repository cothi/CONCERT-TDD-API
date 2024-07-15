import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ChargePointEntity } from 'src/domain/points/entity/charge-point.entity';
import { GetPointEntity } from 'src/domain/points/entity/get-point.entity';
import { PointWalletRepository } from '../../../infrastructure/database/repositories/points/point-wallet.repository';
import { ChargePointModel, GetPointModel } from '../model/point.model';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PointWalletService {
  constructor(
    @Inject(PointWalletRepository)
    private readonly pointWalletRepository: PointWalletRepository,
  ) {}

  async chargePoints(chargePointModel: ChargePointModel) {
    const chargePointEntity = new ChargePointEntity(
      chargePointModel.userId,
      chargePointModel.amount,
    );
    return await this.pointWalletRepository.chargePoints(chargePointEntity);
  }

  async getBalance(getPointModel: GetPointModel) {
    const getPointEntity = new GetPointEntity(getPointModel.userId);
    return await this.pointWalletRepository.getBalance(getPointEntity);
  }

  async deductPoints(userId: string, point: Decimal) {
    const userPoint = await this.pointWalletRepository.getBalance(
      GetPointEntity.create(userId),
    );
    if (userPoint < point) {
      throw new HttpException(
        '유저의 포인트가 부족합니다.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return this.pointWalletRepository.deductPoints(userId, point);
  }
}

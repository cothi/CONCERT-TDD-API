import {
  ChargePointEntity,
  DeductPointEntity,
  GetPointByUserIdEntity,
} from '../entity/point-wallet.entity';
import { UserPoint } from '@prisma/client';
import {
  ChargePointModel,
  DeductPointModel,
  PointWalletModel,
} from 'src/domain/points/model/point-wallet.model';

export class PointWalletMapper {
  static toMapChargePointEntity(model: ChargePointModel): ChargePointEntity {
    const entity = new ChargePointEntity();
    entity.chargeAmount = model.amount;
    entity.userId = model.userId;
    return entity;
  }

  static toMapDeductPointEntity(model: DeductPointModel): DeductPointEntity {
    const entity = new DeductPointEntity();
    entity.usedAmount = model.usedPoint;
    entity.userId = model.userId;
    return entity;
  }
  static toMapGetBalanceByUserIdEntity(
    model: GetPointByUserIdEntity,
  ): GetPointByUserIdEntity {
    const entity = new GetPointByUserIdEntity();
    entity.userId = model.userId;
    return entity;
  }

  static toMapPointModel(entity: UserPoint): PointWalletModel {
    if (!entity) return null;
    const model = PointWalletModel.create(
      entity.id,
      entity.createdAt,
      entity.updatedAt,
      entity.amount,
      entity.userId,
    );
    return model;
  }
}

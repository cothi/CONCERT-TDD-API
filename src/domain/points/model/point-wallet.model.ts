import { PickType } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class PointWalletModel {
  id: string;
  amount: Decimal;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  static create(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    amount: Decimal,
    userId: string,
  ) {
    const model = new PointWalletModel();
    model.amount = amount;
    model.userId = userId;
    model.id = id;
    model.createdAt = createdAt;
    model.updatedAt = updatedAt;
    return model;
  }
}
export class DeductPointModel extends PickType(PointWalletModel, ['userId']) {
  usedPoint: Decimal;
  static create(userId: string, usedPoint: Decimal) {
    const model = new DeductPointModel();
    model.userId = userId;
    model.usedPoint = usedPoint;
    return model;
  }
}
export class ChargePointModel extends PickType(PointWalletModel, [
  'amount',
  'userId',
]) {
  static create(amount: Decimal, userId: string) {
    const model = new ChargePointModel();
    model.amount = amount;
    model.userId = userId;
    return model;
  }
}
export class GetPointByUserIdModel extends PickType(PointWalletModel, [
  'userId',
]) {
  static create(userId: string) {
    const model = new GetPointByUserIdModel();
    model.userId = userId;
    return model;
  }
}

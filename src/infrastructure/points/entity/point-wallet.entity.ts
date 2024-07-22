import { PickType } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class UserPointEntity {
  userId: string;
  amount: Decimal;
}

export class ChargePointEntity extends PickType(UserPointEntity, ['userId']) {
  chargeAmount: Decimal;
}

export class DeductPointEntity extends PickType(UserPointEntity, ['userId']) {
  usedAmount: Decimal;
}

export class GetPointByUserIdEntity extends PickType(UserPointEntity, [
  'userId',
]) {}

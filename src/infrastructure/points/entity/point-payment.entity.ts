import { PickType } from '@nestjs/swagger';
import { PaymentType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class PointPayemntEntity {
  userId: string;
  paymentType: PaymentType;
  amount: Decimal;
}

export class RecordPointHistoryEntity extends PickType(PointPayemntEntity, [
  'amount',
  'paymentType',
  'userId',
]) {}

export class GetPointHistoryByUserIdEntity extends PickType(
  PointPayemntEntity,
  ['userId'],
) {}

import { PickType } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { PaymentType } from '@prisma/client';

export class PointModel {
  amount: Decimal;
  userId: string;
  type: PaymentType;
}

export class ChargePointModel extends PickType(PointModel, [
  'amount',
  'userId',
]) {}

export class CreatePaymentModel extends PickType(PointModel, [
  'amount',
  'userId',
  'type',
]) {}

export class RecordPaymentModel extends PickType(PointModel, [
  'amount',
  'userId',
  'type',
]) {}

export class GetPointModel extends PickType(PointModel, ['userId']) {}

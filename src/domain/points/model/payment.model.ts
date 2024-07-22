import { PickType } from '@nestjs/swagger';
import { PaymentType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class PaymentModel {
  id: string;
  amount: Decimal;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  type: PaymentType;

  static create(
    amount: Decimal,
    userId: string,
    paymentType: PaymentType,
    id: string,
  ) {
    const model = new PaymentModel();

    model.id = id;
    model.amount = amount;
    model.type = paymentType;
    model.userId = userId;
    return model;
  }
}

export class GetPaymentsByUserIdModel extends PickType(PaymentModel, [
  'userId',
]) {
  static create(userId: string) {
    const model = new GetPaymentsByUserIdModel();
    model.userId = userId;
    return model;
  }
}

export class CreatePaymentModel extends PickType(PaymentModel, [
  'amount',
  'userId',
  'type',
]) {
  static create(amount: Decimal, userId: string, paymentType: PaymentType) {
    const model = new CreatePaymentModel();
    model.amount = amount;
    model.type = paymentType;
    model.userId = userId;
    return model;
  }
}

export class RecordPaymentModel extends PickType(PaymentModel, [
  'amount',
  'userId',
  'type',
]) {
  static create(amount: Decimal, userId: string, paymentType: PaymentType) {
    const model = new CreatePaymentModel();
    model.amount = amount;
    model.type = paymentType;
    model.userId = userId;
    return model;
  }
}

import { PaymentType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class RecordPaymentEntity {
  constructor(
    private readonly _userId: string,
    private readonly _paymentType: PaymentType,
    private readonly _amount: Decimal,
  ) {}
  public static create(
    userId: string,
    paymentType: PaymentType,
    amount: Decimal,
  ) {
    return new RecordPaymentEntity(userId, paymentType, amount);
  }

  get userId(): string {
    return this._userId;
  }
  get paymentType(): PaymentType {
    return this._paymentType;
  }
  get amount(): Decimal {
    return this._amount;
  }
}

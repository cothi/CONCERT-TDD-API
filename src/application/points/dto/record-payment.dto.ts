import { Decimal } from '@prisma/client/runtime/library';
import { PaymentType } from '../enums/payment-type.enum';

export class RecordPaymentDto {
  constructor(
    private readonly _userId: string,
    private readonly _transactionType: PaymentType,
    private readonly _amount: Decimal,
  ) {}

  public static create(
    userId: string,
    transactionType: PaymentType,
    amount: Decimal,
  ): RecordPaymentDto {
    return new RecordPaymentDto(userId, transactionType, amount);
  }

  get userId(): string {
    return this._userId;
  }

  get transactionType(): PaymentType {
    return this._transactionType;
  }
  get amount(): Decimal {
    return this._amount;
  }
}

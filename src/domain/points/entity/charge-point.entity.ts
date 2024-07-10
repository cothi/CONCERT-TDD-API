import { Decimal } from '@prisma/client/runtime/library';

export class ChargePointEntity {
  constructor(
    private readonly _userId: string,
    private readonly _chargeAmount: Decimal,
  ) {}

  public static create(userId: string, amount: Decimal) {
    return new ChargePointEntity(userId, amount);
  }

  get userId(): string {
    return this._userId;
  }

  get chargeAmount(): Decimal {
    return this._chargeAmount;
  }
}

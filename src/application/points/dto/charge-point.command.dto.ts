import { Decimal } from '@prisma/client/runtime/library';

export class ChargePointCommand {
  constructor(
    private readonly _amount: Decimal,
    private readonly _userId: string,
  ) {}

  public static create(amount: Decimal, userId: string) {
    return new ChargePointCommand(amount, userId);
  }

  get amount(): Decimal {
    return this._amount;
  }

  get userId(): string {
    return this._userId;
  }
}

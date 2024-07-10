import { Decimal } from '@prisma/client/runtime/library';

export class ChargePointDto {
  constructor(
    public readonly amount: Decimal,
    public readonly userId: string,
  ) {}

  public static create(amount: Decimal, userId: string): ChargePointDto {
    return new ChargePointDto(amount, userId);
  }
}

import { Decimal } from '@prisma/client/runtime/library';
import { IsString } from 'class-validator';

export class ChargePointResponseDto {
  @IsString()
  amount: string;

  @IsString()
  chargeAmount: string;

  public static create(amount: Decimal, chargeAmount: Decimal) {
    const dto = new ChargePointResponseDto();
    dto.amount = new Decimal(amount).toFixed(2);
    dto.chargeAmount = new Decimal(chargeAmount).toFixed(2);
    return dto;
  }
}

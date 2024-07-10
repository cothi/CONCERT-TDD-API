import { Decimal } from '@prisma/client/runtime/library';
import { IsString } from 'class-validator';

export class QueryUserPointResponseDto {
  @IsString()
  amount: string;

  public static create(amount: Decimal) {
    const dto = new QueryUserPointResponseDto();
    dto.amount = new Decimal(amount).toFixed(2);
    return dto;
  }
}

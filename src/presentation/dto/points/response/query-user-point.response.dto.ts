import { Decimal } from '@prisma/client/runtime/library';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryUserPointResponseDto {
  @ApiProperty({
    description: '사용자의 포인트 잔액',
    example: '1000.00',
    type: String,
  })
  @IsString()
  amount: string;

  public static create(amount: Decimal) {
    const dto = new QueryUserPointResponseDto();
    dto.amount = new Decimal(amount).toFixed(2);
    return dto;
  }
}

import { IsNumber } from 'class-validator';

export class ChargePointRequestDto {
  @IsNumber()
  amount: number;
}

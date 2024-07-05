import { ArrayMinSize, IsArray } from 'class-validator';

export class PaymentRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  reservationIds: string[];
}

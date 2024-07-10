import { PaymentType } from '@prisma/client';

export class CreatePaymentDto {
  userId: string;
  amount: number;
  type: PaymentType;
}

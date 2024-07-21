import { PickType } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class transactionModel {
  constructor(
    public transactionId: string,
    public userId: string,
    public amount: Decimal,
    public transactionType: TransactionType,
  ) {}
}

export class CreateTransactionModel extends PickType(transactionModel, [
  'userId',
  'amount',
  'transactionType',
]) {}

export class UpdateTransactionStatusModel extends PickType(transactionModel, [
  'transactionId',
  'transactionType',
]) {}

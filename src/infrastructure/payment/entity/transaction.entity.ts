import { PickType } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionEntity {
  id: string;
  userId: string;
  amount: Decimal;
  transactionType: TransactionType;
}

export class CreateTransactionEntity extends PickType(TransactionEntity, [
  'userId',
  'amount',
  'transactionType',
]) {}

export class GetTransactionByIdEntity extends PickType(TransactionEntity, [
  'id',
]) {}
export class GetTransactionByUserIdEntity extends PickType(TransactionEntity, [
  'userId',
]) {}

export class UpdateTransactionEntity extends PickType(TransactionEntity, [
  'id',
  'transactionType',
]) {}

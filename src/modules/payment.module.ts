/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProcessPaymentUseCase } from 'src/application/payment/use-case/process-payment.use-case';
import { DatabaseModule } from 'src/infrastructure/prisma/prisma.module';
import { PaymentController } from 'src/presentation/controller/payment/payment.controller';
import { PointsModule } from './points.module';
import { ConcertsModule } from './concerts.module';
import { TransactionRepository } from 'src/infrastructure/database/repositories/payment/payment.repository';
import { TransactionService } from 'src/domain/payment/services/transaction.service';

@Module({
  imports: [JwtModule, DatabaseModule, PointsModule, ConcertsModule],
  controllers: [PaymentController],
  providers: [ProcessPaymentUseCase, TransactionService, TransactionRepository],
})
export class PaymentModule {}

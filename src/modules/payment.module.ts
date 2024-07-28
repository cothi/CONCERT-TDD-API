/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProcessPaymentUseCase } from 'src/application/payment/use-case/process-payment.use-case';
import { PaymentController } from 'src/presentation/controller/payment/payment.controller';
import { PointsModule } from './points.module';
import { ConcertsModule } from './concerts.module';
import { TransactionService } from 'src/domain/payment/services/transaction.service';
import { TransactionRepository } from 'src/infrastructure/payment/transaction.repository';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [JwtModule, PointsModule, ConcertsModule, DatabaseModule],
  controllers: [PaymentController],
  providers: [ProcessPaymentUseCase, TransactionService, TransactionRepository],
})
export class PaymentModule {}

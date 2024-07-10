/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PointTransactionService } from 'src/application/points/services/point-transaction.service';
import { PointWalletService } from 'src/application/points/services/point-wallet.service';
import { ChargePointUseCase } from 'src/application/points/user-cases/charge-point.user-case';
import { DatabaseModule } from 'src/infrastructure/database/prisma.module';
import { PointTransactionRepository } from 'src/infrastructure/database/repositories/points/point-transaction.repository';
import { PointWalletRepository } from 'src/infrastructure/database/repositories/points/point-wallet.repository';
import { PointsController } from 'src/presentation/controller/points/points.controller';

@Module({
  imports: [JwtModule, DatabaseModule],
  controllers: [PointsController],
  providers: [
    PointWalletService,
    PointTransactionService,

    PointWalletRepository,
    PointTransactionRepository,

    ChargePointUseCase,
  ],
})
export class PointsModule {}

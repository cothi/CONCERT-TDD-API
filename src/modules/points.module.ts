/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChargePointUseCase } from 'src/application/points/use-cases/charge-point.use-case';
import { QueryUserPointUseCase } from 'src/application/points/use-cases/query-user-point.user-case';
import { PointTransactionService } from 'src/domain/points/services/point-transaction.service';
import { PointWalletService } from 'src/domain/points/services/point-wallet.service';
import { DatabaseModule } from 'src/infrastructure/prisma/prisma.module';
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
    QueryUserPointUseCase,
  ],
})
export class PointsModule {}

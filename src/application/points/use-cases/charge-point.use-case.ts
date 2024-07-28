import { ChargePointResponseDto } from 'src/presentation/dto/points/response/charge-point.response.dto';
import { IUseCase } from '../../../common/interfaces/use-case.interface';
import { ChargePointCommand } from '../dto/charge-point.command.dto';
import { PaymentType } from '../enums/payment-type.enum';
import { PointWalletService } from 'src/domain/points/services/point-wallet.service';
import { PointTransactionService } from 'src/domain/points/services/point-transaction.service';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  ChargePointModel,
  GetPointByUserIdModel,
} from 'src/domain/points/model/point-wallet.model';
import { RecordPaymentModel } from 'src/domain/points/model/payment.model';
import { RedisService } from 'src/infrastructure/database/redis/redis.service';
import { ErrorFactory } from 'src/common/errors/error-factory.error';
import { ErrorCode } from 'src/common/enums/error-code.enum';

@Injectable()
export class ChargePointUseCase
  implements IUseCase<ChargePointCommand, ChargePointResponseDto>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly pointWalletService: PointWalletService,
    private readonly pointTransactionService: PointTransactionService,
    private readonly redisService: RedisService,
  ) {}

  async execute(cmd: ChargePointCommand): Promise<ChargePointResponseDto> {
    const lock = await this.redisService.acquireLock(cmd.userId);
    if (!lock) {
      throw ErrorFactory.createException(ErrorCode.DISTRIBUTED_LOCK_FAILED);
    }

    try {
      const response = await this.prisma.$transaction(async (prisma) => {
        const getModel = GetPointByUserIdModel.create(cmd.userId);
        await this.pointWalletService.getBalance(getModel, prisma);

        // 충전
        const chargeModel = ChargePointModel.create(cmd.amount, cmd.userId);
        const payment = await this.pointWalletService.chargePoints(
          chargeModel,
          prisma,
        );
        // 충전 기록
        const recordModel = RecordPaymentModel.create(
          cmd.amount,
          payment.userId,
          PaymentType.CHARGE,
        );
        await this.pointTransactionService.recordPaymentHistory(
          recordModel,
          prisma,
        );
        const chargePointResponseDto = ChargePointResponseDto.create(
          payment.amount,
          chargeModel.amount,
        );
        return chargePointResponseDto;
      });
      return response;
    } catch (error) {
      throw error;
    } finally {
      await this.redisService.releaseLock(lock);
    }
  }
}

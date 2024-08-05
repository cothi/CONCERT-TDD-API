import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { ErrorFactory } from 'src/common/errors/error-factory.error';
import { RecordPaymentModel } from 'src/domain/points/model/payment.model';
import { ChargePointModel } from 'src/domain/points/model/point-wallet.model';
import { PointTransactionService } from 'src/domain/points/services/point-transaction.service';
import { PointWalletService } from 'src/domain/points/services/point-wallet.service';
import { RedisService } from 'src/infrastructure/database/redis/redis.service';
import { ChargePointResponseDto } from 'src/presentation/dto/points/response/charge-point.response.dto';
import { IUseCase } from '../../../common/interfaces/use-case.interface';
import { ChargePointCommand } from '../dto/charge-point.command.dto';
import { PaymentType } from '../enums/payment-type.enum';

@Injectable()
export class ChargePointUseCase
  implements IUseCase<ChargePointCommand, ChargePointResponseDto>
{
  constructor(
    private readonly pointWalletService: PointWalletService,
    private readonly pointTransactionService: PointTransactionService,
    private readonly redisService: RedisService,
  ) {}

  async execute(cmd: ChargePointCommand): Promise<ChargePointResponseDto> {
    try {
      const lock = await this.redisService.acquireLock(cmd.userId);
      if (!lock) {
        throw ErrorFactory.createException(ErrorCode.DISTRIBUTED_LOCK_FAILED);
      }

      // 충전
      const chargeModel = ChargePointModel.create(cmd.amount, cmd.userId);
      const payment = await this.pointWalletService.chargePoints(chargeModel);

      // 충전 기록
      const recordModel = RecordPaymentModel.create(
        cmd.amount,
        payment.userId,
        PaymentType.CHARGE,
      );

      await this.pointTransactionService.recordPaymentHistory(recordModel);
      const chargePointResponseDto = ChargePointResponseDto.create(
        payment.amount,
        chargeModel.amount,
      );
      await this.redisService.releaseLock(lock);

      return chargePointResponseDto;
    } catch (error) {
      throw error;
    }
  }
}

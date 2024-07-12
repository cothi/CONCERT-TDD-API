import { ChargePointResponseDto } from 'src/presentation/dto/points/response/charge-point.response.dto';
import { IUseCase } from '../../auth/interfaces/use-case.interface';
import { ChargePointCommand } from '../dto/charge-point.command.dto';
import { PaymentType } from '../enums/payment-type.enum';
import { Inject } from '@nestjs/common';
import { PointWalletService } from 'src/domain/points/services/point-wallet.service';
import { PointTransactionService } from 'src/domain/points/services/point-transaction.service';
import { ChargePointModel } from 'src/domain/points/model/point.model';

export class ChargePointUseCase
  implements IUseCase<ChargePointCommand, ChargePointResponseDto>
{
  constructor(
    @Inject(PointWalletService)
    private readonly pointWalletService: PointWalletService,
    @Inject(PointTransactionService)
    private readonly pointTransactionService: PointTransactionService,
  ) {}

  async execute(
    chargePointCommand: ChargePointCommand,
  ): Promise<ChargePointResponseDto> {
    // 충전
    const chargePointDto = new ChargePointModel();
    chargePointDto.amount = chargePointCommand.amount;
    chargePointDto.userId = chargePointCommand.userId;
    const payment = await this.pointWalletService.chargePoints(chargePointDto);
    // 충전 기록
    await this.pointTransactionService.recordPaymentHistory({
      userId: payment.userId,
      type: PaymentType.CHARGE,
      amount: chargePointCommand.amount,
    });

    const chargePointResponseDto = ChargePointResponseDto.create(
      payment.amount,
      chargePointDto.amount,
    );
    return chargePointResponseDto;
  }
}

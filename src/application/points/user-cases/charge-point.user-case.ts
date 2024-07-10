import { ChargePointResponseDto } from 'src/presentation/dto/points/response/charge-point.response.dto';
import { IUseCase } from '../../auth/interfaces/use-case.interface';
import { ChargePointCommand } from '../dto/charge-point.command.dto';
import { PointWalletService } from '../services/point-wallet.service';
import { ChargePointDto } from '../dto/charge-point.dto';
import { RecordPaymentDto } from '../dto/record-payment.dto';
import { PaymentType } from '../enums/payment-type.enum';
import { Inject } from '@nestjs/common';
import { PointTransactionService } from '../services/point-transaction.service';

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
    const chargePointDto = new ChargePointDto(
      chargePointCommand.amount,
      chargePointCommand.userId,
    );
    const payment = await this.pointWalletService.chargePoints(chargePointDto);

    const recordPaymentDto = RecordPaymentDto.create(
      payment.userId,
      PaymentType.CHARGE,
      chargePointCommand.amount,
    );
    await this.pointTransactionService.recordPaymentHistory(recordPaymentDto);

    return ChargePointResponseDto.create(payment.amount, chargePointDto.amount);
  }
}

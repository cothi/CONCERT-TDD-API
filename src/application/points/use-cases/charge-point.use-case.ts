import { ChargePointResponseDto } from 'src/presentation/dto/points/response/charge-point.response.dto';
import { IUseCase } from '../../../common/interfaces/use-case.interface';
import { ChargePointCommand } from '../dto/charge-point.command.dto';
import { PaymentType } from '../enums/payment-type.enum';
import { PointWalletService } from 'src/domain/points/services/point-wallet.service';
import { PointTransactionService } from 'src/domain/points/services/point-transaction.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ChargePointModel } from 'src/domain/points/model/point-wallet.model';
import { RecordPaymentModel } from 'src/domain/points/model/payment.model';

@Injectable()
export class ChargePointUseCase
  implements IUseCase<ChargePointCommand, ChargePointResponseDto>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly pointWalletService: PointWalletService,
    private readonly pointTransactionService: PointTransactionService,
  ) {}

  async execute(cmd: ChargePointCommand): Promise<ChargePointResponseDto> {
    try {
      const response = await this.prisma.$transaction(async (prisma) => {
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
      console.log(error);
      throw error;
    }
  }
}

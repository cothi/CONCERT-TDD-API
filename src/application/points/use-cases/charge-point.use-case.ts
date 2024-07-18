import { ChargePointResponseDto } from 'src/presentation/dto/points/response/charge-point.response.dto';
import { IUseCase } from '../../../common/interfaces/use-case.interface';
import { ChargePointCommand } from '../dto/charge-point.command.dto';
import { PaymentType } from '../enums/payment-type.enum';
import { PointWalletService } from 'src/domain/points/services/point-wallet.service';
import { PointTransactionService } from 'src/domain/points/services/point-transaction.service';
import { ChargePointModel } from 'src/domain/points/model/point.model';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChargePointUseCase
  implements IUseCase<ChargePointCommand, ChargePointResponseDto>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly pointWalletService: PointWalletService,
    private readonly pointTransactionService: PointTransactionService,
  ) {}

  async execute(
    chargePointCommand: ChargePointCommand,
  ): Promise<ChargePointResponseDto> {
    try {
      const response = await this.prisma.$transaction(async (prisma) => {
        // 충전
        const chargePointDto: ChargePointModel = {
          amount: chargePointCommand.amount,
          userId: chargePointCommand.userId,
        };
        const payment = await this.pointWalletService.chargePoints(
          chargePointDto,
          prisma,
        );
        // 충전 기록
        await this.pointTransactionService.recordPaymentHistory(
          {
            userId: payment.userId,
            type: PaymentType.CHARGE,
            amount: chargePointCommand.amount,
          },
          prisma,
        );

        const chargePointResponseDto = ChargePointResponseDto.create(
          payment.amount,
          chargePointDto.amount,
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

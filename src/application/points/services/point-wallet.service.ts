import { Inject, Injectable } from '@nestjs/common';
import { ChargePointDto } from '../dto/charge-point.dto';
import { PointWalletRepository } from '../../../infrastructure/database/repositories/points/point-wallet.repository';
import { ChargePointEntity } from 'src/domain/points/entity/charge-point.entity';

@Injectable()
export class PointWalletService {
  constructor(
    @Inject(PointWalletRepository)
    private readonly pointWalletRepository: PointWalletRepository,
  ) {}

  async chargePoints(chargePointDto: ChargePointDto) {
    const chargePointEntity = new ChargePointEntity(
      chargePointDto.userId,
      chargePointDto.amount,
    );
    return await this.pointWalletRepository.chargePoints(chargePointEntity);
  }

  async getBalance() {}

  async deductPoints() {}
}

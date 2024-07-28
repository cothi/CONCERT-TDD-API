import { IUseCase } from '../../../common/interfaces/use-case.interface';
import { QueryUserPointResponseDto } from 'src/presentation/dto/points/response/query-user-point.response.dto';
import { GetUserPointQuery } from '../dto/get-user-point.query.dto';
import { Inject, Injectable } from '@nestjs/common';
import { PointWalletService } from 'src/domain/points/services/point-wallet.service';
import { GetPointByUserIdModel } from 'src/domain/points/model/point-wallet.model';

@Injectable()
export class QueryUserPointUseCase
  implements IUseCase<GetUserPointQuery, QueryUserPointResponseDto>
{
  constructor(
    @Inject(PointWalletService)
    private readonly pointWalletService: PointWalletService,
  ) {}
  async execute(query: GetUserPointQuery): Promise<QueryUserPointResponseDto> {
    try {
      const getModel = GetPointByUserIdModel.create(query.userId);
      const userPoint = await this.pointWalletService.getBalance(getModel);
      const queryUserPointResponseDto =
        QueryUserPointResponseDto.create(userPoint);
      return queryUserPointResponseDto;
    } catch (error) {
      throw error;
    }
  }
}

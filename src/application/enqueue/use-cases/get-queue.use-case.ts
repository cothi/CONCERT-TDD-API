import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { FindUserByIdModel } from 'src/domain/auth/model/find-use-by-id.model';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { QueueService } from 'src/domain/enqueue/services/enqueue.service';
import { QueueStatusResponseDto } from 'src/presentation/dto/enqueue/response/enqueue-status.reponse.dto';

@Injectable()
export class GetQueueStatusUseCase
  implements IUseCase<string, QueueStatusResponseDto>
{
  constructor(
    private readonly queueService: QueueService,
    private readonly authService: AuthService,
  ) {}

  async execute(userId: string): Promise<QueueStatusResponseDto> {
    try {
      const findModel = FindUserByIdModel.create(userId);
      const user = await this.authService.findUserById(findModel);
      const position = await this.queueService.getQueuePosition(user.id);
      return QueueStatusResponseDto.create(position.status, position.position);
    } catch (error) {
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { FindUserByIdModel } from 'src/domain/auth/model/find-use-by-id.model';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { QueueService } from 'src/domain/enqueue/services/enqueue.service';
import { EnqueueDto } from 'src/presentation/dto/enqueue/request/enqueue.dto';
import { EnqueueResponseDto } from 'src/presentation/dto/enqueue/response/enqueue.response.dto';
@Injectable()
export class EnqueueUseCase
  implements IUseCase<EnqueueDto, EnqueueResponseDto>
{
  constructor(
    private readonly authService: AuthService,
    private readonly queueService: QueueService,
  ) {}

  async execute(dto: EnqueueDto): Promise<EnqueueResponseDto> {
    const findModel = FindUserByIdModel.create(dto.userId);
    const user = await this.authService.findUserById(findModel);
    const position = await this.queueService.enqueue(user.id);

    return {
      position: position,
    };
  }
}

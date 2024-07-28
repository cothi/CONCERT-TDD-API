import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { FindUserByIdModel } from 'src/domain/auth/model/find-use-by-id.model';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { CreateEnqueueModel } from 'src/domain/enqueue/model/enqueue.model';
import { QueueService } from 'src/domain/enqueue/services/enqueue.service';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { EnqueueDto } from 'src/presentation/dto/enqueue/request/enqueue.dto';
import { EnqueueResponseDto } from 'src/presentation/dto/enqueue/response/enqueue.response.dto';
@Injectable()
export class EnqueueUseCase
  implements IUseCase<EnqueueDto, EnqueueResponseDto>
{
  constructor(
    private readonly queueService: QueueService,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async execute(dto: EnqueueDto): Promise<EnqueueResponseDto> {
    try {
      const responseDto = await this.prismaService.$transaction(
        async (prisma) => {
          const findModel = FindUserByIdModel.create(dto.userId);
          const user = await this.authService.findUserById(findModel);
          const createModel = CreateEnqueueModel.create(user.id);
          const queueEntry = await this.queueService.enqueue(
            createModel,
            prisma,
          );

          return {
            status: queueEntry.status,
            enteredAt: queueEntry.enteredAt,
          };
        },
      );
      return responseDto;
    } catch (error) {
      throw error;
    }
  }
}

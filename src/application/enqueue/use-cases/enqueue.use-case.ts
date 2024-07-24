import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { CreateEnqueueModel } from 'src/domain/enqueue/model/enqueue.model';
import { QueueService } from 'src/domain/enqueue/services/enqueue.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { EnqueueDto } from 'src/presentation/dto/enqueue/request/enqueue.dto';
import { EnqueueResponseDto } from 'src/presentation/dto/enqueue/response/enqueue.response.dto';
@Injectable()
export class EnqueueUseCase
  implements IUseCase<EnqueueDto, EnqueueResponseDto>
{
  constructor(
    private readonly queueService: QueueService,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(dto: EnqueueDto): Promise<EnqueueResponseDto> {
    try {
      const responseDto = await this.prismaService.$transaction(
        async (prisma) => {
          const createModel = CreateEnqueueModel.create(dto.userId);
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

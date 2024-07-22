import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { CreateSeatResponseDto } from 'src/presentation/dto/concerts/dto/response/create-seat.response.dto';
import { CreateSeatCommand } from '../command/create-seat.command';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateSeatsModel } from 'src/domain/concerts/model/seat.model';
import { SeatStatus } from '@prisma/client';

@Injectable()
export class CreateSeatUseCase
  implements IUseCase<CreateSeatCommand, CreateSeatResponseDto>
{
  constructor(private readonly seatService: SeatService) {}
  async execute(cmd: CreateSeatCommand): Promise<CreateSeatResponseDto> {
    try {
      const createSeatsModel: CreateSeatsModel = {
        concertDateId: cmd.concertDateId,
        seatNumber: cmd.seatNumber,
        price: new Decimal(cmd.price),
        status: SeatStatus.AVAILABLE,
      };
      const batch = await this.seatService.createSeat(createSeatsModel);
      return {
        success: true,
        createdSeatsCount: batch.count,
        concertDateId: cmd.concertDateId,
      };
    } catch (error) {
      throw error;
    }
  }
}

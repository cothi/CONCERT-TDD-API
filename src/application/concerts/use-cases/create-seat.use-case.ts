import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { CreateSeatResponseDto } from 'src/presentation/dto/concerts/dto/response/create-seat.response.dto';
import { CreateSeatCommand } from '../command/create-seat.command';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { SeatStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateSeatsModel } from 'src/domain/concerts/model/seat.model';

@Injectable()
export class CreateSeatUseCase
  implements IUseCase<CreateSeatCommand, CreateSeatResponseDto>
{
  constructor(private readonly seatService: SeatService) {}
  async execute(input: CreateSeatCommand): Promise<CreateSeatResponseDto> {
    try {
      const createSeatsModel: CreateSeatsModel = {
        concertDateId: input.concertDateId,
        seatNumber: input.seatNumber,
        price: new Decimal(input.price),
        status: SeatStatus.AVAILABLE,
      };
      const batch = await this.seatService.createSeat(createSeatsModel);
      return {
        success: true,
        createdSeatsCount: batch.count,
        concertDateId: input.concertDateId,
      };
    } catch (error) {
      throw error;
    }
  }
}

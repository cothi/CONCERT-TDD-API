import { Injectable } from '@nestjs/common';
import { GetSeatByConcertDateIdModel } from 'src/domain/concerts/model/seat.model';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { GetSeatsByConcertIdResponseDto } from './../../../presentation/dto/concerts/dto/response/get-seats-by-concertid.dto';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { GetSeatsByConcertIdCommand } from '../command/get-seats-by-concertId.command';
@Injectable()
export class GetConcertSeatsUseCase
  implements
    IUseCase<GetSeatsByConcertIdCommand, GetSeatsByConcertIdResponseDto>
{
  constructor(private readonly seatService: SeatService) {}

  async execute(
    cmd: GetSeatsByConcertIdCommand,
  ): Promise<GetSeatsByConcertIdResponseDto> {
    try {
      const model: GetSeatByConcertDateIdModel = {
        concertDateId: cmd.concertDateId,
      };
      const seats = await this.seatService.getSeatsByConcertDateId(model);
      return GetSeatsByConcertIdResponseDto.fromSeats(seats);
    } catch (error) {
      throw error;
    }
  }
}

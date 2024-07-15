import { Injectable } from '@nestjs/common';
import { GetSeatByConcertDateIdModel } from 'src/domain/concerts/model/seat.model';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { GetSeatsByConcertIdResponseDto } from './../../../presentation/dto/concerts/dto/response/get-seats-by-concertid.dto';
import { GetSeatsByConcertIdCommand } from './../command/get-concert-by-concertId.command';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
@Injectable()
export class GetConcertSeatsUseCase
  implements
    IUseCase<GetSeatsByConcertIdCommand, GetSeatsByConcertIdResponseDto>
{
  constructor(private readonly seatService: SeatService) {}

  async execute(
    command: GetSeatsByConcertIdCommand,
  ): Promise<GetSeatsByConcertIdResponseDto> {
    try {
      const model: GetSeatByConcertDateIdModel = {
        concertDateId: command.concertDateId,
      };

      const seats = await this.seatService.getSeatsByConcertDateId(model);

      return GetSeatsByConcertIdResponseDto.fromSeats(seats);
    } catch (error) {
      throw error;
    }
  }
}

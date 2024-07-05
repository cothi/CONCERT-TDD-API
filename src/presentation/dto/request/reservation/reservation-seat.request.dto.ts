import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class ReservationSeatRequestDto {
  @IsString()
  concertId: string;

  @IsArray()
  @ArrayMinSize(1)
  seatIds: string[];
}

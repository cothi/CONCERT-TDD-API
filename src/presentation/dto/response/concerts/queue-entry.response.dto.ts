import { IsString } from 'class-validator';

export class queueEntryResponseDto {
  @IsString()
  concert: string;
}

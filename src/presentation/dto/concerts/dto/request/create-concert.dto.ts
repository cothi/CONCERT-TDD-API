import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateConcertDto {
  @ApiProperty({
    example: '2023 여름 록 페스티벌',
    description: '콘서트 이름',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;
}

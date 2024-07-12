import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: '등록할 사용자의 이메일 주소',
    example: 'newuser@example.com',
  })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  email: string;
}

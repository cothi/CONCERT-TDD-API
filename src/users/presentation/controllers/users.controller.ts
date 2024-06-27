import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { UsersServiceSymbol } from 'src/users/application/services/users.service.impl';
import { CreateUserDto } from '../dto/request/create-user.request.dto';
import { UsersService } from 'src/users/application/services/user.service';
import { UserResponseDto } from '../dto/response/user.response.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersServiceSymbol) private readonly usersService: UsersService,
  ) {}

  // TODO 모든 유저를 가져오는 API를 구현하세요져
  @Get()
  async getAllUsers(): Promise<UserResponseDto> {
    return await this.usersService.getAllUsers();
  }

  // TODO 유저를 생성하는 API를 구현하세요
  @Post('create')
  async postUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.createUser(createUserDto);
  }

  // TODO 특정 유저를 가져오는 API를 구현하세요
  @Post('get')
  async getUser(@Body('email') email: string): Promise<UserResponseDto> {
    return await this.usersService.getUser(email);
  }
}

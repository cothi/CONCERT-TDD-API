import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { CreateUserDto, UserOutputDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';
import { UsersServiceSymbol } from '../services/users.service.impl';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersServiceSymbol) private readonly usersService: UsersService,
  ) {}

  // TODO 모든 유저를 가져오는 API를 구현하세요져
  @Get()
  async getAllUsers(): Promise<UserOutputDto> {
    return await this.usersService.getAllUsers();
  }

  // TODO 유저를 생성하는 API를 구현하세요
  @Post('create')
  async postUser(@Body() createUserDto: CreateUserDto): Promise<UserOutputDto>{
    return await this.usersService.createUser(createUserDto);
  }

  // TODO 특정 유저를 가져오는 API를 구현하세요
  @Post('get')
  async getUser(@Body('email') email: string): Promise<UserOutputDto>{
    return await this.usersService.getUser(email);
  }
}

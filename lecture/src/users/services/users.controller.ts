import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO 모든 유저를 가져오는 API를 구현하세요져
  @Get()
  async getAllUsers() {}

  // TODO 유저를 생성하는 API를 구현하세요
  @Post('create')
  async postUser(@Body() createUserDto: CreateUserDto) {}

  // TODO 특정 유저를 가져오는 API를 구현하세요
  @Get(':id')
  async getUser(@Param('id') id: string) {}
}

import { Module } from '@nestjs/common';
import {
  UsersServiceImpl,
  UsersServiceSymbol,
} from './services/users.service.impl';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  UsersRepositoryImpl,
  UsersRepositorySymbol,
} from './repositories/users.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    {
      provide: UsersServiceSymbol,
      useClass: UsersServiceImpl,
    },
    {
      provide: UsersRepositorySymbol,
      useClass: UsersRepositoryImpl,
    },
  ],
})
export class UsersModule {}

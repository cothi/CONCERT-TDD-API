import { Module } from '@nestjs/common';
import {
  UsersServiceImpl,
  UsersServiceSymbol,
} from './application/services/users.service.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import {
  UsersRepositoryImpl,
  UsersRepositorySymbol,
} from './infrastructure/persistence/repositories/users.repository.impl';
import { UsersController } from './presentation/controllers/users.controller';

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

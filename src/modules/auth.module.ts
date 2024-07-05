import { Module } from '@nestjs/common';
import { AuthController } from '../presentation/controller/auth/auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}

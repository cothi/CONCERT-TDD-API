import { Module } from '@nestjs/common';
import { ConcertsController } from 'src/presentation/controller/concerts/concerts.controller';

@Module({
  imports: [],
  controllers: [ConcertsController],
  providers: [],
})
export class ConcertsModule {}

import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from 'src/common/config/winston.config';
import { LoggerService } from 'src/common/logger/logger.serivce';

@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import * as Joi from 'joi';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from 'src/common/config/winston.config';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from 'src/common/intercept/api-response.intercept';
import { AuthModule } from './auth.module';
import { ConcertsModule } from './concerts.module';
import { EnqueueModule } from './enqueue.module';
import { LoggerModule } from './logger.module';
import { PaymentModule } from './payment.module';
import { PointsModule } from './points.module';
import { CacheModule } from 'src/common/cache/cache.module';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    CacheModule,
    PaymentModule,
    EnqueueModule,
    LoggerModule,
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev').default('dev'),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().default('1h'),
        DATABASE_URL: Joi.string().required(),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_HOST: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    AuthModule,
    PointsModule,
    ConcertsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
  ],
})
export class AppModule {}

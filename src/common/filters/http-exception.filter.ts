import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '../logger/logger.serivce';
import { ErrorFactory } from '../errors/error-factory.error';
import { ErrorCode } from '../enums/error-code.enum';
import { ExceptionResDto } from '../dto/response/base.response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let httpStatusCode: HttpStatus;

    if (exception instanceof HttpException) {
      this.logger.warn(`Error: ${exception.message} `, {
        status: exception.getStatus(),
        path: request.url,
        method: request.method,
      });
      httpStatusCode = HttpStatus.OK;
    } else {
      const unhandle = ErrorFactory.createException(
        ErrorCode.INTERNAL_SERVER_ERROR,
      );

      this.logger.warn(`Error: ${exception} `, {
        stausCode: unhandle.getStatus(),
        path: request.url,
        method: request.method,
      });
      exception = unhandle;
      httpStatusCode = unhandle.getStatus();
    }

    const res = ExceptionResDto.create(
      false,
      exception.getStatus(),
      exception.message,
    );
    response.status(httpStatusCode).json(res.toResponse());
  }
}

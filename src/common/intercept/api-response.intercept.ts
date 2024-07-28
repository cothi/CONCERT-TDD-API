import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ApiResponse } from '../interfaces/api-response.interface';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next
      .handle()
      .pipe(map((data: T) => this.transformResponse(context, data)));
  }

  private transformResponse(
    context: ExecutionContext,
    data: T,
  ): ApiResponse<T> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    return {
      data,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }
}

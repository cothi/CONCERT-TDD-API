import { HttpStatus } from '@nestjs/common';

export type ReturnError = {
  message: string;
  statusCode: HttpStatus;
};

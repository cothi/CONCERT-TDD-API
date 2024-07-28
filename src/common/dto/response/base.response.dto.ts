export class BaseResponseDto<T> {}

export class ExceptionResDto {
  private constructor(
    private readonly _success: boolean,
    private readonly _statusCode: number,
    private readonly _message?: string,
  ) {}

  static create(
    success: boolean,
    statusCode: number,
    message?: string,
  ): ExceptionResDto {
    const dto = new ExceptionResDto(success, statusCode, message);
    return dto;
  }

  toResponse(): Record<string, any> {
    return {
      success: this._success,
      statusCode: this._statusCode,
      message: this._message,
    };
  }
}

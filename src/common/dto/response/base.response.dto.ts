export class BaseResponseDto<T> {}

export class ExceptionResDto {
  private constructor(success: boolean, statusCode: number, message?: string) {}

  static create(
    success: boolean,
    statusCode: number,
    message?: string,
  ): ExceptionResDto {
    const dto = new ExceptionResDto(success, statusCode, message);
    return dto;
  }
}

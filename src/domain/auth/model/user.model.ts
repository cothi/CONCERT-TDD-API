// 도메인 유저 모델
export class UserModel {
  constructor(
    private readonly _id: string,
    private readonly _email: string,
  ) {}

  public static create(email: string, id: string): UserModel {
    return new UserModel(id, email);
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }
}

// 도메인 유저 모델
export class UserModel {
  private readonly _id: string;
  private readonly _email: string;

  private constructor(email: string, id?: string) {
    this._id = id;
    this._email = email;
  }

  public static create(email: string, id: string): UserModel {
    return new UserModel(email, id);
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }
}

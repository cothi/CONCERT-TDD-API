import { LoginUserEntity } from '../entity/login-user.entity';

export class LoginUserModel {
  constructor(private readonly _email: string) {}

  public static create(email: string) {
    return new LoginUserModel(email);
  }

  toEntity(): LoginUserEntity {
    return new LoginUserEntity(this.email);
  }

  get email(): string {
    return this._email;
  }
}

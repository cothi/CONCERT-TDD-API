import { RegisterUserEntity } from '../entity/register-user.entity';

export class RegisterUserModel {
  constructor(private readonly _email: string) {}

  public static create(email: string) {
    return new RegisterUserModel(email);
  }

  toEntity(): RegisterUserEntity {
    return new RegisterUserEntity(this.email);
  }

  get email(): string {
    return this._email;
  }
}

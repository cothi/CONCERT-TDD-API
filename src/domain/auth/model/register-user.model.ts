
export class RegisterUserModel {
  constructor(private readonly _email: string) {}

  public static create(email: string) {
    return new RegisterUserModel(email);
  }

  get email(): string {
    return this._email;
  }
}

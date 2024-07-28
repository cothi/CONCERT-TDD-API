
export class LoginUserModel {
  constructor(private readonly _email: string) {}
  public static create(email: string) {
    return new LoginUserModel(email);
  }

  get email(): string {
    return this._email;
  }
}

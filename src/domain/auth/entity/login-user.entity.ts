export class LoginUserEntity {
  constructor(private readonly _email: string) {}

  public static create(email: string) {
    return new LoginUserEntity(email);
  }
  get email(): string {
    return this._email;
  }
}

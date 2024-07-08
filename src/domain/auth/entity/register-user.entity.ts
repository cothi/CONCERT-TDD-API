export class RegisterUserEntity {
  constructor(private readonly _email: string) {}

  public static create(email: string) {
    return new RegisterUserEntity(email);
  }

  get email(): string {
    return this._email;
  }
}

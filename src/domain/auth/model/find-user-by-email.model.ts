export class FindUserByEmailModel {
  constructor(private readonly _email: string) { }
  static create(email: string) {
    return new FindUserByEmailModel(email);
  }

  get email(): string {
    return this._email;
  }
}
export class RefreshTokenModel {
  constructor(private readonly _accessToken: string) {}

  public static create(accessToken: string) {
    return new RefreshTokenModel(accessToken);
  }

  get accessToken(): string {
    return this._accessToken;
  }
}

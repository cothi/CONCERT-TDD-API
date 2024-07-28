export class RefreshTokenModel {
  constructor(private readonly _refreshToken: string) {}

  public static create(refreshToken: string) {
    return new RefreshTokenModel(refreshToken);
  }

  get accessToken(): string {
    return this._refreshToken;
  }
}

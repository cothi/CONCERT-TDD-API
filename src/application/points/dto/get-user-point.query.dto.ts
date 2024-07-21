export class GetUserPointQuery {
  constructor(private readonly _userId: string) {}

  public static create(userId: string): GetUserPointQuery {
    return new GetUserPointQuery(userId);
  }
  get userId(): string {
    return this._userId;
  }
}

export class GetPointEntity {
  constructor(private readonly _userId: string) {}

  public static create(userId: string): GetPointEntity {
    return new GetPointEntity(userId);
  }
  get userId(): string {
    return this._userId;
  }
}

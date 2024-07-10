export class GetPointModel {
  constructor(public readonly _userId: string) {}

  public static create(userId: string) {
    return new GetPointModel(userId);
  }

  get userId(): string {
    return this.userId;
  }
}

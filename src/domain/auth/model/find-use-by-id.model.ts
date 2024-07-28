export class FindUserByIdModel{

  constructor(private readonly _id: string) { }

  static create(id: string) {
    return new FindUserByIdModel(id); 
  }

  get id(): string {
    return this._id;
  }
}
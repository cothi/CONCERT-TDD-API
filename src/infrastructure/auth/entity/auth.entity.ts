import { PickType } from "@nestjs/swagger";

export class userEntity {
  id: string;
  email: string;
}
export class RegisterUserEntity extends PickType(userEntity, ['email']) { }
export class LoginUserEntity extends PickType(userEntity, ['email']) { }
export class FindUserByIdEntity extends PickType(userEntity, ['id']) { }
export class FindUserByEmailEntity extends PickType(userEntity, ['email']) { }
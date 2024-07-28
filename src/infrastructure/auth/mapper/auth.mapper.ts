import { User } from "@prisma/client";
import { FindUserByIdModel } from "src/domain/auth/model/find-use-by-id.model";
import { FindUserByEmailModel } from "src/domain/auth/model/find-user-by-email.model";
import { RegisterUserModel } from "src/domain/auth/model/register-user.model";
import { UserModel } from "src/domain/auth/model/user.model";
import { FindUserByEmailEntity, FindUserByIdEntity, LoginUserEntity, RegisterUserEntity } from "../entity/auth.entity";

export class AuthMapper {
  static mapToRegisterUserEntity(model: RegisterUserModel): RegisterUserEntity{
    const entity = new RegisterUserEntity();
    entity.email = model.email;
    return entity;
  }

  static mapToFindUserByEmailEntity(model: FindUserByEmailModel): LoginUserEntity {
    const entity = new FindUserByEmailEntity() 
    entity.email = model.email;
    return entity;
  }

  static mapToFindUserByIdEntity(model: FindUserByIdModel): FindUserByIdEntity {
    const entity = new FindUserByIdEntity();
    entity.id = model.id;
    return entity
  }

  static mapToUserModel(entity: User): UserModel{
    if (!entity) {
      return null
    }
    const model = new UserModel(entity.id, entity.email);
    return model;
  }
}
import { CreateUserDto, UserOutputDto } from '../dto/create-user.dto';

export interface UsersService {
  createUser(data: CreateUserDto): Promise<UserOutputDto>;
}

import { CreateUserDto, UserOutputDto } from '../dto/create-user.dto';

export interface UsersService {
  createUser(data: CreateUserDto): Promise<UserOutputDto>;
  getUser(name: string): Promise<UserOutputDto>;
  getAllUsers(): Promise<UserOutputDto>;
}

import { CreateUserDto } from 'src/users/presentation/dto/request/create-user.request.dto';
import { User } from '../entities/user.entity';

export interface UsersRepository {
  createUser(data: CreateUserDto): Promise<User>;
  getUser(data: string): Promise<User>;
  getAllUsers(): Promise<User[]>;
}

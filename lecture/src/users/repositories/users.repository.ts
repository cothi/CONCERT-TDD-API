import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

export interface UsersRepository {
  createUser(data: CreateUserDto): Promise<User>;
  getUser(data: string): Promise<User>;
  getAllUsers(): Promise<User[]>;
}

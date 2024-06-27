import { CreateUserDto } from 'src/users/presentation/dto/request/create-user.request.dto';
import { UserResponseDto } from 'src/users/presentation/dto/response/user.response.dto';

export interface UsersService {
  createUser(data: CreateUserDto): Promise<UserResponseDto>;
  getUser(name: string): Promise<UserResponseDto>;
  getAllUsers(): Promise<UserResponseDto>;
}

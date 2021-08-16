import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { User } from './entities/users.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async getAllUser(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async createUser(user: Partial<User>) {
    if (user.username.length < 5)
      throw new BadRequestException('Username must be of minimum 5 characters');

    if (user.password.length < 8)
      throw new BadRequestException('Password must be of minimum 8 characters');
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      username: user.username,
    });
    if (existingUser) {
      throw new ConflictException('This username is already taken');
    }

    const newUser = new User();

    newUser.username = user.username;
    newUser.password = user.password;
    newUser.email = user.email;
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.bio = user.bio;
    newUser.avatar = user.avatar;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...savedUser } = await newUser.save();
    return savedUser;
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ username: username });
  }
}

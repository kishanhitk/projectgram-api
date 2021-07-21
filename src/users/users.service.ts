import { Injectable } from '@nestjs/common';
import { User } from './entities/users.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async getAllUser(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async createUser(user: Partial<User>) {
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

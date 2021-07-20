import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/users.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}

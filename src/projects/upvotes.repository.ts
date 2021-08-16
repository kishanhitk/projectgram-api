import { EntityRepository, Repository } from 'typeorm';
import { Vote } from './project_upvotes.entity';

@EntityRepository(Vote)
export class VoteRepository extends Repository<Vote> {}

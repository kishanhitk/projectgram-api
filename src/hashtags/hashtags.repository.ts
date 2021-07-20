import { EntityRepository, Repository } from 'typeorm';
import { HashTag } from './entities/hashtags.entity';

@EntityRepository(HashTag)
export class HashTagRepository extends Repository<HashTag> {}

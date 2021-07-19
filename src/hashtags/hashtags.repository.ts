import { EntityRepository, Repository } from 'typeorm';
import { HashTag } from './hashtags.entity';

@EntityRepository(HashTag)
export class HashTagRepository extends Repository<HashTag> {}

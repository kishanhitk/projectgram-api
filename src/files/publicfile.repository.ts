import { EntityRepository, Repository } from 'typeorm';
import { PublicFile } from './publicfiles.entity';

@EntityRepository(PublicFile)
export class PublicFileRepository extends Repository<PublicFile> {}

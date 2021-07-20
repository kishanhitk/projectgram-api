import { EntityRepository, Repository } from 'typeorm';
import { Project } from './projects.entity';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {}

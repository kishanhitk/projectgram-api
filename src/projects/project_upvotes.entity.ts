import { Entity, ManyToOne } from 'typeorm';
import { PBaseEntity } from 'src/common/base.entity';
import { User } from 'src/users/entities/users.entity';
import { Project } from './projects.entity';

@Entity('vote')
export class Vote extends PBaseEntity {
  @ManyToOne(() => Project, (project) => project.votes)
  project: Project;

  @ManyToOne(() => User, (user) => user.votes)
  user: User;
}

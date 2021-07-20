import { PBaseEntity } from 'src/common/base.entity';
import { Project } from 'src/projects/projects.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('comments')
export class Comment extends PBaseEntity {
  @Column({ name: 'string', length: 200 })
  body: string;

  @ManyToOne(() => Project, (project) => project.comments)
  project: Project;

  @ManyToOne(() => User, (user) => user.comments)
  commenter: User;
}

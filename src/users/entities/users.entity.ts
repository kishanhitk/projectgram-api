import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PBaseEntity } from 'src/common/base.entity';
import { Project } from 'src/projects/projects.entity';
import { Vote } from 'src/projects/project_upvotes.entity';
import { Comment } from 'src/comments/comments.entity';
@Entity('users')
export class User extends PBaseEntity {
  @Column({ length: 30, nullable: false, unique: true })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  github_username?: string;

  @Column({
    nullable: false,
  })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    console.error('UNENCRY password' + this.password);
    this.password = await bcrypt.hash(this.password, 10);
    console.error('ENCRY password' + this.password);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
  @Column({ nullable: false, length: 25 })
  firstName: string;

  @Column({ nullable: true, length: 25 })
  lastName?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true, length: 100 })
  bio?: string;

  @OneToMany(() => Project, (project) => project.creator)
  projects: Project[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @OneToMany(() => Comment, (comment) => comment.commenter)
  comments: Comment[];
}

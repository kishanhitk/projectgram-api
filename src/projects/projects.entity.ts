import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PBaseEntity } from 'src/common/base.entity';
import { User } from 'src/users/users.entity';
import { Vote } from './project_upvotes.entity';
import { Comment } from 'src/comments/comments.entity';
import { HashTag } from 'src/hashtags/hashtags.entity';

@Entity('projects')
export class Project extends PBaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, length: 50, unique: true })
  slug: string;

  @Column({ nullable: false, length: 240 })
  shortDescription: string;

  @Column({ nullable: true, length: 4000 })
  longDescription?: string;

  @ManyToOne(() => User, (user) => user.projects)
  creator: User;

  @Column({ type: 'text', array: true })
  images: string[];

  @Column()
  souceLink: string;

  @Column()
  website: string;

  @Column('bigint')
  upvote_count: number;

  @OneToMany(() => Vote, (vote) => vote.project)
  votes: Vote[];

  @OneToMany(() => Comment, (comment) => comment.project)
  comments: Comment[];

  @ManyToMany(() => HashTag)
  @JoinTable()
  categories: HashTag[];
}

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { PBaseEntity } from 'src/common/base.entity';
import { User } from 'src/users/entities/users.entity';
import { Vote } from './project_upvotes.entity';
import { Comment } from 'src/comments/comments.entity';
import { HashTag } from 'src/hashtags/entities/hashtags.entity';
import { PublicFile } from 'src/files/publicfiles.entity';

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

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  bannerImage?: PublicFile;

  @Column({ type: 'text', array: true, nullable: true })
  screenshots?: string[];

  @Column({ nullable: true })
  souceLink?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: 'bigint', default: 0 })
  upvote_count: number;

  @OneToMany(() => Vote, (vote) => vote.project)
  votes: Vote[];

  @OneToMany(() => Comment, (comment) => comment.project)
  comments: Comment[];

  @ManyToMany(() => HashTag)
  @JoinTable()
  hashtags: HashTag[];
}

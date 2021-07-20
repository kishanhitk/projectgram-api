import { PBaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';
export enum HashTagType {
  'language',
  'framework',
  'topic',
}
@Entity('hashtags')
export class HashTag extends PBaseEntity {
  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'text', nullable: false })
  type: HashTagType;
}

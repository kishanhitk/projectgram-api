import { PBaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';
enum HashTagType {
  'language',
  'framework',
  'topic',
}
@Entity('hashtags')
export class HashTag extends PBaseEntity {
  @Column({ type: 'text', unique: true })
  name: string;

  @Column()
  type: HashTagType;
}

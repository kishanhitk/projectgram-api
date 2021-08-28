import { PBaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('public_files')
export class PublicFile extends PBaseEntity {
  @Column()
  public url: string;

  @Column()
  public key: string;
}

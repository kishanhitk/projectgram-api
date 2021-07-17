import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PBaseEntity } from 'src/common/base.entity';

@Entity('users')
export class UserEntity extends PBaseEntity {
  @Column({ length: 30, nullable: false, unique: true })
  username: string;

  @Column({
    nullable: false,
  })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
  @Column({ nullable: false, length: 25 })
  firstName: string;

  @Column({ nullable: true, length: 25 })
  lastName: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true, length: 100 })
  bio?: string;
}

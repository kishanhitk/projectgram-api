import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/users.entity';
import { Project } from '../projects.entity';

export class CreateCommentDto {
  @ApiProperty() body: string;
  @ApiProperty() project: Project;
  @ApiProperty() commenter: User;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HashTag } from 'src/hashtags/entities/hashtags.entity';
import { User } from 'src/users/entities/users.entity';

export class CreateProjectDTO {
  @ApiProperty() title: string;
  @ApiProperty() shortDescription: string;
  @ApiPropertyOptional() hashtags: HashTag[];
  @ApiPropertyOptional() longDescription?: string;
}

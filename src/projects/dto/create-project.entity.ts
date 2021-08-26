import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HashTag } from 'src/hashtags/entities/hashtags.entity';

export class CreateProjectDTO {
  @ApiProperty() title: string;
  @ApiProperty() shortDescription: string;
  @ApiPropertyOptional() hashtags: HashTag[];
  @ApiPropertyOptional() bannerImage?: any;
  @ApiPropertyOptional() longDescription?: string;
  @ApiPropertyOptional() screenshots?: string[];
}

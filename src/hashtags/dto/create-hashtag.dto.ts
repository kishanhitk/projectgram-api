import { HashTagType } from '../entities/hashtags.entity';

export class CreateHashTagDto {
  name: string;
  type: HashTagType;
}

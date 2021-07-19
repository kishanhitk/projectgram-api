import { HashTagType } from './hashtags.entity';

export class CreateHashTagDto {
  name: string;
  type: HashTagType;
}

export class DeleteHashTagDto {
  name: string;
}

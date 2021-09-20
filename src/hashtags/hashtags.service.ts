import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { HashTag, HashTagType } from './entities/hashtags.entity';
import { HashTagRepository } from './hashtags.repository';

@Injectable()
export class HashtagsService {
  constructor(private hashtagRepository: HashTagRepository) {}

  async getAllHashTags() {
    return await this.hashtagRepository.find();
  }
  async getMutipleHashTagsByID(ids: string[]) {
    return await this.hashtagRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async createNewHashTag(hashTagTitle: string, hashTagType: HashTagType) {
    const hashtag = new HashTag();
    hashtag.name = hashTagTitle;
    hashtag.type = hashTagType;
    await hashtag.save();
    return hashtag;
  }

  async deleteHashTag(hashTagTitle: string) {
    return await this.hashtagRepository.delete({ name: hashTagTitle });
  }
}

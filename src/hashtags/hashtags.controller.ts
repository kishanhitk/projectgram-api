import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CreateHashTagDto, DeleteHashTagDto } from './create-hashtag.dto';
import { HashTag } from './hashtags.entity';
import { HashtagsService } from './hashtags.service';

@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get()
  async getAllHashTags(): Promise<HashTag[]> {
    return this.hashtagsService.getAllHashTags();
  }

  @Post()
  async createNewHashTags(
    @Body() createHashTagDto: CreateHashTagDto,
  ): Promise<HashTag> {
    console.log(createHashTagDto);
    return await this.hashtagsService.createNewHashTag(
      createHashTagDto.name,
      createHashTagDto.type,
    );
  }

  @Delete()
  async deleteHashTag(
    @Body() deleteHashTagDto: DeleteHashTagDto,
  ): Promise<DeleteResult> {
    return await this.hashtagsService.deleteHashTag(deleteHashTagDto.name);
  }
}

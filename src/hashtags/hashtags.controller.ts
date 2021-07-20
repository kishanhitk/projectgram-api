import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CreateHashTagDto } from './dto/create-hashtag.dto';
import { DeleteHashTagDto } from './dto/delete-hashtag.dto';
import { HashTag } from './entities/hashtags.entity';
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

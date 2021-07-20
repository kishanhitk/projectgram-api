import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { HashTag, HashTagType } from './entities/hashtags.entity';
import { HashtagsService } from './hashtags.service';
class CreateHashtagRequestBody {
  @ApiProperty() name: string;
  @ApiProperty() type: HashTagType;
}
class DeleteHashtagRequestBody {
  @ApiProperty() name: string;
}
@ApiTags('Hashtags')
@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get()
  async getAllHashTags(): Promise<HashTag[]> {
    return this.hashtagsService.getAllHashTags();
  }

  @Post()
  async createNewHashTags(
    @Body() createHashTagDto: CreateHashtagRequestBody,
  ): Promise<HashTag> {
    console.log(createHashTagDto);
    return await this.hashtagsService.createNewHashTag(
      createHashTagDto.name,
      createHashTagDto.type,
    );
  }

  @Delete()
  async deleteHashTag(
    @Body() deleteHashTagDto: DeleteHashtagRequestBody,
  ): Promise<DeleteResult> {
    return await this.hashtagsService.deleteHashTag(deleteHashTagDto.name);
  }
}

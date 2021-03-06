import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
  async getAllHashTags(): Promise<HashTag[] | any> {
    return await this.hashtagsService.getAllHashTags();
  }

  @UseGuards(JwtAuthGuard)
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

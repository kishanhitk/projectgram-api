import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagsController } from './hashtags.controller';
import { HashTagRepository } from './hashtags.repository';
import { HashtagsService } from './hashtags.service';

@Module({
  imports: [TypeOrmModule.forFeature([HashTagRepository])],
  controllers: [HashtagsController],
  providers: [HashtagsService],
})
export class HashtagsModule {}

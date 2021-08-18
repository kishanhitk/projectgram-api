import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentRepository } from 'src/comments/comments.repository';
import { UsersModule } from 'src/users/users.module';
import { ProjectsController } from './projects.controller';
import { ProjectRepository } from './projects.repository';
import { ProjectsService } from './projects.service';
import { VoteRepository } from './upvotes.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectRepository,
      CommentRepository,
      VoteRepository,
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}

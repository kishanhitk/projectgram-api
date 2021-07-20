import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectRepository } from './projects.repository';
import { ProjectsService } from './projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}

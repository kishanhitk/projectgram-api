import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateProjectDTO } from './dto/create-project.entity';
import { Project } from './projects.entity';
import { ProjectsService } from './projects.service';

@ApiTags('Project')
@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}
  @Get()
  async findAll(): Promise<Project[]> {
    return await this.projectService.getAllProjects();
  }

  @Post()
  async createNewProject(
    @Body() projectCreateRequestBody: CreateProjectDTO,
  ): Promise<Project> {
    return await this.projectService.createProject(projectCreateRequestBody);
  }
  @Post('/:slug/comments')
  async createComment(
    @Param('slug') slug: string,
    @Body() comment: CreateCommentDto,
  ) {
    return await this.projectService.createComment(comment);
  }
  @Get('/:slug/comments')
  async getCommentsOfProject(@Param('slug') slug: string): Promise<Project> {
    return await this.projectService.getAllCommentsOfAProject(slug);
  }

  @Get('/:slug')
  async getProjectBySlug(@Param('slug') slug: string): Promise<Project> {
    return await this.projectService.getProjectBySlug(slug);
  }
}

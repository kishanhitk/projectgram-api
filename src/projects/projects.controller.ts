import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { HashTag } from 'src/hashtags/entities/hashtags.entity';
import { User } from 'src/users/entities/users.entity';
import { ProjectsService } from './projects.service';

export class ProjectCreateRequestBody {
  @ApiProperty() title: string;
  @ApiProperty() shortDescription: string;
  @ApiProperty() creator: User;
  @ApiPropertyOptional() hashtags: HashTag[];
  @ApiPropertyOptional() longDescription?: string;
}

@ApiTags('Project')
@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}
  @Get()
  async findAll(): Promise<any> {
    return await this.projectService.getAllProjects();
  }

  @Post()
  async createNewProject(
    @Body() projectCreateRequestBody: ProjectCreateRequestBody,
  ): Promise<any> {
    return await this.projectService.createProject(projectCreateRequestBody);
  }

  @Get('/:slug')
  async getUser(@Param('slug') slug: string) {
    return await this.projectService.getProjectBySlug(slug);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateProjectDTO } from './dto/create-project.entity';
import { Project } from './projects.entity';
import { ProjectsService } from './projects.service';
import { Vote } from './project_upvotes.entity';

@ApiTags('Project')
@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}
  @Get()
  async findAll(): Promise<Project[]> {
    return await this.projectService.getAllProjects();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createNewProject(
    @Body() projectCreateRequestBody: CreateProjectDTO,
    @Req() req: any,
  ): Promise<Project> {
    return await this.projectService.createProject(
      projectCreateRequestBody,
      req.user.username,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:slug/upvote')
  async upvoteProject(
    @Param('slug') slug: string,
    @Req() req: any,
  ): Promise<Vote | any> {
    return await this.projectService.upvoteProject(slug, req.user.username);
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

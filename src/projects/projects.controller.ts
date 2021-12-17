import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  async getAllProjects(
    @Query('sortBy') sortBy: string,
    @Query('tag') tag: string,
  ): Promise<Project[]> {
    return await this.projectService.getAllProjects(sortBy, tag);
  }

  @Get('/search')
  async search(@Query('q') q: string): Promise<Project[]> {
    return await this.projectService.fullTextSearchByQuery(q);
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
  @Post('/upload/bannerImage')
  @UseInterceptors(FileInterceptor('bannerImage'))
  async uploadBannerImage(
    @Body('projectId') projectId: string,
    @UploadedFile() bannerImage: Express.Multer.File,
  ): Promise<Project> {
    return await this.projectService.uploadBannerImage(
      bannerImage?.buffer,
      bannerImage?.originalname,
      projectId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:slug/upvote')
  async getUpvoteDetailsOfaUserOnaProject(
    @Param('slug') slug: string,
    @Req() req: any,
  ): Promise<Vote | any> {
    return await this.projectService.getUpvoteFromSlugAndUser(
      slug,
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

  @UseGuards(JwtAuthGuard)
  @Delete('/:slug/upvote')
  async deleteVote(
    @Param('slug') slug: string,
    @Req() req: any,
  ): Promise<Vote | any> {
    return await this.projectService.deleteVote(slug, req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:slug/comments')
  async createComment(
    @Param('slug') slug: string,
    @Body() comment: CreateCommentDto,
    @Req() req: any,
  ) {
    return await this.projectService.createComment(
      comment,
      slug,
      req.user.username,
    );
  }

  @Get('/:slug/comments')
  async getCommentsOfProject(@Param('slug') slug: string): Promise<Project> {
    return await this.projectService.getAllCommentsOfAProject(slug);
  }

  @Get('/:slug')
  async getProjectBySlug(@Param('slug') slug: string): Promise<Project> {
    return await this.projectService.getProjectBySlug(slug);
  }

  @Delete('/:slug')
  async deleteProjectBySlug(@Param('slug') slug: string): Promise<any> {
    return await this.projectService.deleteProjectBySlug(slug);
  }
}

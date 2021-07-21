import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { CommentRepository } from 'src/comments/comments.repository';
import { Project } from './projects.entity';
import { ProjectRepository } from './projects.repository';
import { Comment } from 'src/comments/comments.entity';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class ProjectsService {
  constructor(
    private projectRepository: ProjectRepository,
    private commentRepository: CommentRepository,
    private userServices: UsersService,
  ) {}
  async getAllProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['hashtags', 'creator'],
      order: { createdAt: 'DESC' },
    });
  }

  async createProject(project: Partial<Project>, username: string) {
    project.slug = slugify(project.title, '_');
    const creator = await this.userServices.getUserByUsername(username);
    project.creator = creator;
    return await this.projectRepository.save(project);
  }

  async getProjectBySlug(slug: string): Promise<Project> {
    return this.projectRepository.findOne(
      { slug: slug },
      { relations: ['hashtags', 'creator', 'comments', 'votes'] },
    );
  }

  async getAllCommentsOfAProject(projectSlug: string): Promise<any> {
    return await this.commentRepository.find({
      where: { project: { slug: projectSlug } },
    });
  }

  async createComment(commentDto: Partial<Comment>) {
    return await this.commentRepository.save(commentDto);
  }
}

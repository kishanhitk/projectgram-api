import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { CommentRepository } from 'src/comments/comments.repository';
import { Project } from './projects.entity';
import { ProjectRepository } from './projects.repository';
@Injectable()
export class ProjectsService {
  constructor(
    private projectRepository: ProjectRepository,
    private commentRepository: CommentRepository,
  ) {}
  // constructor(private commentRepository: CommentRepository) {}
  async getAllProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['hashtags', 'creator'],
      order: { createdAt: 'DESC' },
    });
  }

  async createProject(project: Partial<Project>) {
    project.slug = slugify(project.title, '_');
    return await this.projectRepository.save(project);
  }

  async getProjectBySlug(slug: string): Promise<Project> {
    return this.projectRepository.findOne(
      { slug: slug },
      { relations: ['hashtags', 'creator', 'comments', 'votes'] },
    );
  }

  async getAllCommentsOfAProject(projectId: string): Promise<any> {
    return await this.commentRepository.find({
      where: { project: { slug: projectId } },
    });
  }
}

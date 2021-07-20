import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { ProjectCreateRequestBody } from './projects.controller';
import { Project } from './projects.entity';
import { ProjectRepository } from './projects.repository';
@Injectable()
export class ProjectsService {
  constructor(private projectRepository: ProjectRepository) {}
  //Gets all projects
  async getAllProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['hashtags', 'creator'],
      order: { createdAt: 'DESC' },
    });
  }

  async createProject(project: ProjectCreateRequestBody) {
    const newProject = new Project();
    newProject.title = project.title;
    newProject.shortDescription = project.shortDescription;
    newProject.creator = project.creator;
    newProject.hashtags = project.hashtags;
    newProject.slug = slugify(project.title, '_');
    return await newProject.save();
  }

  async getProjectBySlug(slug: string): Promise<Project> {
    return this.projectRepository.findOne(
      { slug: slug },
      { relations: ['hashtags', 'creator', 'comments', 'votes'] },
    );
  }
}

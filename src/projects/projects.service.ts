import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import slugify from 'slugify';
import { CommentRepository } from 'src/comments/comments.repository';
import { Project } from './projects.entity';
import { ProjectRepository } from './projects.repository';
import { Comment } from 'src/comments/comments.entity';
import { UsersService } from 'src/users/users.service';
import { Vote } from './project_upvotes.entity';
import { VoteRepository } from './upvotes.repository';
@Injectable()
export class ProjectsService {
  constructor(
    private projectRepository: ProjectRepository,
    private commentRepository: CommentRepository,
    private userServices: UsersService,
    private voteRepository: VoteRepository,
  ) {}
  async getAllProjects(sortBy: string): Promise<Project[]> {
    switch (sortBy) {
      case 'new':
        return await this.projectRepository.find({
          order: { createdAt: 'DESC' },
        });
      case 'popular':
        return await this.projectRepository.find({
          order: { upvote_count: 'DESC' },
        });
      case 'trending':
        //TODO: #2 Implement trending projects
        return await this.projectRepository.find({
          order: { upvote_count: 'DESC' },
        });
      default:
        return await this.projectRepository.find({
          order: { createdAt: 'DESC' },
        });
    }
  }

  async createProject(project: Partial<Project>, username: string) {
    project.slug = slugify(project.title, { replacement: '_', lower: true });
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
    const project = await this.projectRepository.findOne({
      slug: projectSlug,
    });
    return await this.commentRepository.find({
      where: { project: project },
    });
  }

  async createComment(
    commentDto: Partial<Comment>,
    slug: string,
    username: string,
  ) {
    const user = await this.userServices.getUserByUsername(username);
    const project = await this.projectRepository.findOne({
      slug: slug,
    });
    //Check if project exists
    if (!project) {
      throw new BadRequestException('Project does not exist');
    }
    const comment = new Comment();

    comment.commenter = user;
    comment.project = project;
    comment.body = commentDto.body;
    return await comment.save();
  }

  async upvoteProject(projectSlug: string, username: string) {
    const user = await this.userServices.getUserByUsername(username);
    const project = await this.projectRepository.findOne({ slug: projectSlug });

    //Check if project exists
    if (!project) {
      throw new BadRequestException('Project does not exist');
    }
    // Check if user has already upvoted the project
    const upvote = await this.voteRepository.findOne({
      where: { user: user, project: project },
    });
    if (upvote) {
      return new ConflictException(
        'This user has already upvoted this project',
      );
    }
    const upVote = new Vote();
    upVote.user = user;
    upVote.project = project;
    const savedVote = await this.voteRepository.save(upVote);
    project.upvote_count++;
    project.save();
    return savedVote;
  }

  async deleteVote(projectSlug: string, username: string) {
    const user = await this.userServices.getUserByUsername(username);
    const project = await this.projectRepository.findOne({ slug: projectSlug });

    //Check if project exists
    if (!project) {
      throw new BadRequestException('Project does not exist');
    }
    // Check if user has already upvoted the project
    const vote = await this.voteRepository.findOne({
      where: { user: user, project: project },
    });
    console.error(vote);
    if (!vote) {
      throw new BadRequestException('This user has not upvoted this project');
    }
    await vote.remove();
    project.upvote_count--;
    project.save();
    return project;
  }
}

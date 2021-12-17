import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
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
import { ILike, MoreThan } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { HashtagsService } from 'src/hashtags/hashtags.service';
import { CreateProjectDTO } from './dto/create-project.entity';
import { HashTag } from 'src/hashtags/entities/hashtags.entity';
@Injectable()
export class ProjectsService {
  constructor(
    private projectRepository: ProjectRepository,
    private commentRepository: CommentRepository,
    @Inject(forwardRef(() => UsersService))
    private userServices: UsersService,
    private voteRepository: VoteRepository,
    private filesService: FilesService,
    private hashtagsService: HashtagsService,
  ) {}
  async getAllProjects(sortBy: string, tag: string): Promise<Project[]> {
    let projectQuery = this.projectRepository.createQueryBuilder('project');
    if (tag) {
      projectQuery = projectQuery
        .leftJoin('project.hashtags', 'hashtags')
        .where('hashtags.name = :tag', { tag });
    }
    switch (sortBy) {
      case 'new':
        return projectQuery.orderBy('project.createdAt', 'DESC').getMany();
      case 'popular':
        return projectQuery.orderBy('project.upvote_count', 'DESC').getMany();
      case 'trending':
        //Find votes of last 7 days
        const recentVotes = await this.voteRepository.find({
          relations: ['project'],
          where: {
            createdAt: MoreThan(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
          },
        });
        //Find projects that have been voted on
        const votedOnProjects = recentVotes.map((vote) => vote.project.id);
        if (votedOnProjects?.length > 0) {
          projectQuery = projectQuery.where('project.id IN (:...ids)', {
            ids: [...votedOnProjects],
          });
        }
        return projectQuery.orderBy('project.upvote_count', 'DESC').getMany();
      default:
        return projectQuery.orderBy('project.createdAt', 'DESC').getMany();
    }
  }

  async fullTextSearchByQuery(searchTerm: string): Promise<Project[]> {
    return await this.projectRepository.find({
      where: [
        {
          title: ILike(`%${searchTerm}%`),
        },
        {
          shortDescription: ILike(`%${searchTerm}%`),
        },
        {
          longDescription: ILike(`%${searchTerm}%`),
        },
      ],
      order: { upvote_count: 'DESC' },
    });
  }

  async createProject(project: CreateProjectDTO, username: string) {
    const creator = await this.userServices.getUserByUsername(username);
    let hashtags: HashTag[] = null;
    console.log(project.hashtags);
    if (project.tags?.length > 0) {
      hashtags = await this.hashtagsService.getMutipleHashTagsByID(
        project.tags,
      );
    }
    const slug = slugify(project.title, { replacement: '_', lower: true });
    return await this.projectRepository
      .create({
        hashtags,
        creator,
        slug,
        ...project,
      })
      .save();
  }

  async getProjectBySlug(slug: string): Promise<Project> {
    return this.projectRepository.findOne(
      { slug: slug },
      { relations: ['hashtags', 'creator', 'comments', 'votes'] },
    );
  }
  async getProjectsByTag(tag: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: {
        hashtags: {
          name: tag,
        },
      },
      relations: ['hashtags', 'creator', 'comments', 'votes'],
    });
  }

  async getAllCommentsOfAProject(projectSlug: string): Promise<any> {
    const project = await this.projectRepository.findOne({
      slug: projectSlug,
    });
    return await this.commentRepository.find({
      where: { project: project },
      relations: ['commenter'],
      order: { createdAt: 'DESC' },
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
  async getUpvoteFromSlugAndUser(projectSlug: string, username: string) {
    const user = await this.userServices.getUserByUsername(username);
    const project = await this.projectRepository.findOne({
      slug: projectSlug,
    });
    //Check if project exists
    if (!project) {
      throw new BadRequestException('Project does not exist');
    }
    const vote = await this.voteRepository.findOne({
      where: { user: user, project: project },
    });
    return vote;
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
      throw new ConflictException('You have already upvoted this project');
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
  async getAllProjectsOfAUser(username: string): Promise<Project[]> {
    const user = await this.userServices.getUserByUsername(username);
    return await this.projectRepository.find({
      where: {
        creator: user,
      },
    });
  }
  async uploadBannerImage(
    imageBuffer: Buffer,
    filename: string,
    projectId: string,
  ) {
    const bannerImage = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    const project = await this.projectRepository.findOne(projectId);
    project.bannerImage = bannerImage;
    const updatedProject = await this.projectRepository.save(project);
    return updatedProject;
  }

  async deleteProjectBySlug(slug: string) {
    return await this.projectRepository.delete({ slug: slug });
  }
}

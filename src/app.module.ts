import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { CommentsModule } from './comments/comments.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { Project } from './projects/projects.entity';
import { HashTag } from './hashtags/hashtags.entity';
import { Vote } from './projects/project_upvotes.entity';
import { Comment } from './comments/comments.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pgadmin',
      password: 'pgpass',
      database: 'projectgram',
      entities: [User, Project, HashTag, Comment, Vote],
      synchronize: true,
    }),
    UsersModule,
    ProjectsModule,
    CommentsModule,
    HashtagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

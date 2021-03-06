import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { CommentsModule } from './comments/comments.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { Project } from './projects/projects.entity';
import { HashTag } from './hashtags/entities/hashtags.entity';
import { Vote } from './projects/project_upvotes.entity';
import { Comment } from './comments/comments.entity';
import { ExampleModule } from './example/example.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import { PublicFile } from './files/publicfiles.entity';
import { GoogleAuthModule } from './google-auth/google-auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local', '.env.dev'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(
      //TODO: Improve this
      process.env.NODE_ENV === 'production'
        ? {
            ssl: { rejectUnauthorized: false },
            type: 'postgres',
            host: process.env.DBHOST,
            port: Number(process.env.DBPORT),
            username: process.env.DBUSER,
            password: process.env.DBPASS,
            database: process.env.DBNAME,
            logging: 'all',
            url: process.env.DATABASE_URL,
            entities: [User, Project, HashTag, Comment, Vote, PublicFile],
            synchronize: true,
          }
        : {
            type: 'postgres',
            host: process.env.DBHOST,
            port: Number(process.env.DBPORT),
            username: process.env.DBUSER,
            password: process.env.DBPASS,
            database: process.env.DBNAME,
            logging: 'all',
            url: process.env.DATABASE_URL,
            entities: [User, Project, HashTag, Comment, Vote, PublicFile],
            synchronize: true,
          },
    ),
    UsersModule,
    ProjectsModule,
    CommentsModule,
    HashtagsModule,
    ExampleModule,
    AuthModule,
    FilesModule,
    GoogleAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

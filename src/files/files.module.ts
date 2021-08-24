import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { PublicFileRepository } from './publicfile.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFileRepository])],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}

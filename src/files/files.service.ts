import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { PublicFileRepository } from './publicfile.repository';

@Injectable()
export class FilesService {
  constructor(private publicFilesRepository: PublicFileRepository) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();

    let uploadResult: S3.ManagedUpload.SendData;
    try {
      uploadResult = await s3
        .upload({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          Body: dataBuffer,
          Key: `${uuid()}-${filename}`,
        })
        .promise();
      console.log(uploadResult);
    } catch (err) {
      console.log(uploadResult);
      console.log(err);
      throw new InternalServerErrorException('Error uploading file');
    }
    const newFile = this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }
}

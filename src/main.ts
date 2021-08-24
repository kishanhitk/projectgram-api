import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const docsConfig = new DocumentBuilder()
    .setTitle('ProjectGram - API')
    .setDescription('The ProjectGram API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT || 4000);
}
bootstrap();

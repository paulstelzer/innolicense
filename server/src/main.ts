import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as session from 'express-session';

//import * as passport from 'passport';

import 'dotenv/config';

import * as bodyParser from 'body-parser';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { logger } from './common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(session({
    secret: process.env.secretkey,
    resave: true,
    saveUninitialized: true
  }));

  /* 
  app.use(passport.initialize());
  app.use(passport.session()); 
  */

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(logger);


  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('License API')
    .setVersion('1.0')
    .addTag('license')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

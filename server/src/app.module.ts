import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { LicenseModule } from './license/license.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import 'dotenv/config';
import { platformEnvironment } from './constants';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.dbusername,
      password: process.env.dbpassword,
      database: process.env.dbdatabase,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      //logging: true
      /*       cache: {
              duration: 30000 // 30 seconds
            } */
    }),
    UsersModule,
    LicenseModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
  ],
})
export class AppModule implements NestModule {
  constructor() { }

  configure(consumer: MiddlewareConsumer) {
    /*
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(AppController);
      */
  }
}

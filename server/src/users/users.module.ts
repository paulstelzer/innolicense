// Common
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodemailerModule } from './../nodemailer/nodemailer.module';

// Services
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { UserMailService } from './services/user-mail.service';

// Controller
import { UsersController } from './controller/users.controller';
import { AuthController } from './controller/auth.controller';

// Entity
import { Users } from './interfaces/users.entity';
import { UsersVerify } from './interfaces/users-verify.entity';

// Guards
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './guards/jwt.strategy';

const providers = [
  UsersService,
  AuthService,
  UserMailService,
  JwtStrategy,
  RolesGuard
]

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UsersVerify]),
    NodemailerModule
  ],
  controllers: [
    UsersController,
    AuthController
  ],
  providers: [
    ...providers
  ],
  exports: [
    ...providers
  ],
})
export class UsersModule { }

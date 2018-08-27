import { Get, Controller, Res, HttpStatus } from '@nestjs/common';
import { platformEnvironment } from './constants';
import { MailerService } from './nodemailer/mailer.service';

@Controller()
export class AppController {
  constructor() { }

  @Get()
  root() {
    return {
      version: `${platformEnvironment.version}`,
    };
  }
}

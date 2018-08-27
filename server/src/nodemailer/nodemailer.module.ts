import { Module, DynamicModule } from '@nestjs/common';
import { CustomValue } from '@nestjs/core/injector/module';
import { MailerService } from './mailer.service';
import { platformEnvironment } from '../constants';
import { NodemailerCoreModule } from './nodemailer-core.module';

@Module({
  imports: [
    NodemailerCoreModule.forRoot(platformEnvironment.mailerConfig),
  ],
  controllers: [],
  providers: [],
  exports: [
    NodemailerCoreModule
  ],
})
export class NodemailerModule { }

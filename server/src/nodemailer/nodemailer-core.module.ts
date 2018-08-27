import { Module, DynamicModule } from '@nestjs/common';
import { CustomValue } from '@nestjs/core/injector/module';
import { MailerService } from './mailer.service';
import { platformEnvironment } from '../constants';

@Module({
    imports: [],
    controllers: [],
    providers: [],
    exports: [],
})
export class NodemailerCoreModule {
    static forRoot(config): DynamicModule {
        const MailerConfig: CustomValue = {
            name: 'MAILER_CONFIG',
            provide: 'MAILER_CONFIG',
            useValue: config
        };

        return {
            module: NodemailerCoreModule,
            providers: [
                MailerConfig,
                MailerService,
            ],
            exports: [
                MailerConfig,
                MailerService,
            ],
        };
    }
}

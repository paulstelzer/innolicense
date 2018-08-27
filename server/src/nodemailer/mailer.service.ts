import { Injectable, Inject } from '@nestjs/common';
import { createTransport, SentMessageInfo, Transporter, SendMailOptions } from 'nodemailer';
import { platformEnvironment } from '../constants';

@Injectable()
export class MailerService {

    private transporter: Transporter;

    // mailerConfig = platformEnvironment.mailerConfig;

    constructor(
        @Inject('MAILER_CONFIG') private readonly config: any
    ) {
        if ((!config.transport) || (Object.keys(config.transport).length < 1)) {
            throw new Error('Make sure to provide a nodemailer transport configuration object, connection url or a transport plugin instance')
        }

        this.setupTransporter(this.config.transport, this.config.defaults, this.config.templateDir);
    }

    private setupTransporter(transport: any, defaults?: any, templateDir?: string): void {
        this.transporter = createTransport(transport, defaults);
    }

    public async sendMailWithOptions(sendMailOptions: SendMailOptions): Promise<SentMessageInfo> {
        return await this.transporter.sendMail(sendMailOptions);
    }

    public async sendMail(to, subject, html, from = platformEnvironment.defaultEmail): Promise<SentMessageInfo> {
        const sendMailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: html // HTML body content
        }
        try {
            const data = await this.transporter.sendMail(sendMailOptions);
            console.log('Mail send to', to);
            return data;
        } catch (error) {
            console.log('Mail could not send to', to);
        }
        return null;
    }

}

import { platformEnvironment } from './../../constants';
import { MailerService } from './../../nodemailer/mailer.service';
import { Injectable } from '@nestjs/common';
import { UsersVerify } from '../interfaces/users-verify.entity';

@Injectable()
export class UserMailService {
    constructor(
        private mailer: MailerService,
    ) { }


    async sendVerifyEmail(verified: UsersVerify) {
        if (!verified) return;
        if (!verified.token || !verified.user) return;

        let template = '';
        if (verified.user.roles.find(ele => ele === 'vendor')) {
            template = `<p>Hallo %NAME%,</p><p>dein Account auf ${platformEnvironment.platform.name} wurde angelegt. Um Produkte, Lizenzen und Lizenznummern anzulegen, musst du deine E-Mail-Adresse bestätigen!</p><p>Zum Bestätigen hier klicken: %URL%</p><p>Solltest du keinen Account bei ${platformEnvironment.platform.name} angelegt haben, so ignoriere diese E-Mail einfach!</p><p>Freundliche Grüße<br />${platformEnvironment.platform.admin}</p>`;
        }
        else {
            template = `<p>Hallo %NAME%,</p><p>ein Account wurde für dich auf ${platformEnvironment.platform.name} angelegt. Damit erhälst du die Lizenznummer und Updates rund um deine Lizenz. Damit wir dir Emails rund um die Updates und deine Lizenz senden können, musst du deine Email-Adresse bestätigen!</p><p>Zum Bestätigen hier klicken: %URL%</p><p>Wenn du deine Email-Adresse nicht bestätigst, werden wir keine weitere Email rund um deine Lizenznummer und Updates schicken.</p><p>Freundliche Grüße<br />${platformEnvironment.platform.admin}</p>`;
        }


        const url = `${platformEnvironment.platform.url}#/login/verify?uid=${verified.userId}&token=${verified.token}`;
        template = template.replace('%URL%', url);
        template = template.replace('%NAME%', verified.user.name ? verified.user.name : '');

        this.mailer.sendMail(verified.user.email, `[${platformEnvironment.platform.name}] Bestätige deine Email-Adresse`, template);
    }

}

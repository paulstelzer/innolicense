import { Users, UserMail } from 'users/interfaces/users.entity';
import { WpPlugin } from './../interfaces/wp-plugin.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan, MoreThan } from 'typeorm';
import { LicenseService } from './license.service';
import { CreatePluginDto, UpdateWpPluginDto } from '../interfaces/wp-plugin.dto';
import { Licensenumber } from '../interfaces/licensenumber.entity';
import { LicenseErrorCode } from '../../common/interfaces/license.error.code';
import { MailerService } from '../../nodemailer/mailer.service';

@Injectable()
export class WpPluginService {

    constructor(
        @InjectRepository(WpPlugin)
        private readonly wpPluginRepository: Repository<WpPlugin>,
        @InjectRepository(Licensenumber)
        private readonly licensenumberRepository: Repository<Licensenumber>,
        private readonly licenseService: LicenseService,
        private mailer: MailerService
    ) { }

    async getPlugins(user: Users) {
        return await this.wpPluginRepository.find({
            where: { userId: user.id }
        })
    }

    async getPlugin(slug, relations = false) {
        let options = {};
        if (relations) options = { relations: ['licenses'] };
        return await this.wpPluginRepository.findOne({
            ...options,
            where: { slug: slug }
        });
    }

    async createPlugin(body: CreatePluginDto, user: Users) {
        if (!body.name || !body.version || !body.downloadUrl || !body.description) {
            throw {
                errorCode: LicenseErrorCode.DATA_PARAMS_MISSING
            }
        };

        const plug = await this.getPlugin(body.slug, false);

        if (plug) {
            throw {
                errorCode: LicenseErrorCode.PLUGIN_SLUG_IN_USE
            }
        }

        const plugin = new WpPlugin(body.name, body.slug, body.version, body.downloadUrl, body.description, user);

        if (body.author) plugin.author = body.author;
        if (body.authorHomepage) plugin.authorHomepage = body.authorHomepage;
        if (body.homepage) plugin.homepage = body.homepage;
        if (body.requires) plugin.requires = body.requires;
        if (body.tested) plugin.tested = body.tested;

        const savedPlugin = await plugin.save();
        return savedPlugin;

    }

    async addLicense(slug, licenseId, userId) {
        if (!slug || !licenseId || !userId) {
            throw {
                errorCode: LicenseErrorCode.DATA_PARAMS_MISSING
            }
        }

        // Get WP Product
        const plug = await this.getPlugin(slug, true);

        if (!plug) {
            throw {
                errorCode: LicenseErrorCode.PLUGIN_NOT_FOUND
            }
        }

        if (plug.userId !== userId) {
            throw {
                errorCode: LicenseErrorCode.PLUGIN_NOT_FOUND
            }
        }

        const license = await this.licenseService.getLicense(licenseId);

        if (!license) {
            throw {
                errorCode: LicenseErrorCode.LICENSE_NOT_FOUND
            }
        }

        if (plug.licenses) {
            const index = plug.licenses.findIndex(element => element.id === licenseId);

            if (index >= 0) {
                plug.licenses.splice(index, 1);
            } else {
                plug.licenses.push(license);
            }
        }
        else {
            plug.licenses = [license];
        }
        const saved = await plug.save();

        return saved;

    }

    async deletePlugin(slug, userId) {
        const plugin = await this.getPlugin(slug);
        if (plugin && plugin.userId === userId) {
            this.wpPluginRepository.delete({ slug: slug });
        } else {
            throw {
                errorCode: LicenseErrorCode.PLUGIN_NOT_FOUND
            }
        }
    }

    async updatePlugin(slug, body: UpdateWpPluginDto, userId) {
        const plugin = await this.getPlugin(slug);

        if (slug !== body.data.slug) {
            const checkSlug = await this.getPlugin(body.data.slug);
            if (checkSlug) {
                throw {
                    errorCode: LicenseErrorCode.PLUGIN_SLUG_IN_USE
                }
            }
        }

        if (plugin && plugin.userId === userId) {
            if (plugin.version && body.data.version && plugin.version !== body.data.version && body.notify) {
                this.notifyUser(plugin, body);
            }

            return await this.wpPluginRepository.update({ slug: slug }, { ...body.data });
        }
        return null;
    }

    async notifyUser(plug, body: UpdateWpPluginDto) {
        const plugin: WpPlugin = {
            ...plug,
            ...body.data
        }

        const data = await this.wpPluginRepository.findOne({
            select: ['id'],
            relations: ['licenses'],
            where: {
                slug: plugin.slug
            }
        })

        if (data && data.licenses && data.licenses.length > 0) {
            const ids = [];
            for (let l of data.licenses) {
                ids.push(l.id);
            }
            //console.log('Licenses with this id', ids);

            const date = new Date();
            const licenseUsers = await this.licensenumberRepository.find({
                relations: ['user'],
                where: {
                    licenseId: In(ids),
                    supportUntil: MoreThan(date)
                }
            })

            //console.log('Users', licenseUsers);

            if (licenseUsers && licenseUsers.length > 0) {
                let userMails: UserMail[] = [];
                for (let u of licenseUsers) {
                    const notify = u.notify;
                    const verified = u.user.verified;
                    const email = u.user.email;
                    const name = u.user.name ? u.user.name : '';
                    const filter = userMails.filter(element => element.email === email);
                    if (filter.length === 0) {
                        userMails.push({
                            email,
                            name,
                            verified,
                            notify
                        });
                    }
                }

                // Removes duplicates - initial x is empty array - y comes from userIds
                //userMails = userMails.reduce((x, y) => x.includes(y) ? x : [...x, y], []);
                //console.log('UserMails', userMails);

                this.sendMails(userMails, plugin, body.template);
            }


        }
    }

    async sendMails(userMails: UserMail[], plugin: WpPlugin, template: string) {
        // Create Template
        if (!template) {
            template = `<p>Hallo %NAME%,</p><p>für das Plugin ${plugin.name} ist eine neue Version (${plugin.version}) verfügbar. Du kannst das Plugin einfach über Plugins in deinem WordPress Backend updaten. Tippe ggf. auf 'Nach Updates suchen', um hiernach Ausschau zu halten. Alternativ kannst du es auch herunterladen und manuell installieren. Hier der Download-Link: ${plugin.downloadUrl}.</p><p>Du erhälst diese Email, weil du dir das Plugin gekauft und eine Lizenz hast.</p><p>Freundliche Grüße<br />${plugin.author} </p>`;
        }

        // Send Message to every usermail
        for (let user of userMails) {
            if (user.verified) {
                template = template.replace('%NAME%', user.name ? user.name : '');
                this.mailer.sendMail(user.email, 'Neue Version des Plugins ' + plugin.name, template);
            }
        }

    }

}
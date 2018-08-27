import { AuthErrorCode } from './../../common/interfaces/auth.error.code';
import { Licensenumber } from './../interfaces/licensenumber.entity';
import { UsersService } from './../../users/services/users.service';
import { License } from './../interfaces/license.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../interfaces/product.entity';
import { Repository, createQueryBuilder } from 'typeorm';
import { CheckLicenseNumberDto } from '../interfaces/license.dto';

import axios, { AxiosResponse } from 'axios';
import { EnvatoItem } from '../interfaces/envato-item.entity';
import { WpPlugin } from '../interfaces/wp-plugin.entity';
import { CreateEnvatoItemDto } from '../interfaces/wp-plugin.dto';
import { LicenseErrorCode } from '../../common/interfaces/license.error.code';
import { Users, UserMail } from '../../users/interfaces/users.entity';
import { MailerService } from '../../nodemailer/mailer.service';
import { platformEnvironment } from '../../constants';

@Injectable()
export class LicenseService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(License)
        private readonly licenseRepository: Repository<License>,
        @InjectRepository(Licensenumber)
        private readonly licensenumberRepository: Repository<Licensenumber>,
        @InjectRepository(EnvatoItem)
        private readonly envatoRepository: Repository<EnvatoItem>,
        @InjectRepository(WpPlugin)
        private readonly wpPluginRepository: Repository<WpPlugin>,

        private readonly usersService: UsersService,
        private mailer: MailerService,
    ) { }

    async getProducts(userId: number) {
        return await this.productRepository.find({ userId: userId });
    }

    async deleteProduct(id, userId) {
        return await this.productRepository.delete({ id: id, userId: userId })
    }

    async updateLicense(productId, licenseid, body, userId) {
        if (licenseid !== body.id) {
            throw {
                errorCode: LicenseErrorCode.LICENSE_WRONG_ID
            }
        }

        const product = await this.getProduct(productId, userId);
        if (!product) {
            throw {
                errorCode: LicenseErrorCode.NO_PRODUCT
            }
        }
        delete body.product;
        delete body.id;
        delete body.productId;
        return await this.licenseRepository.update({ id: licenseid }, { ...body });
    }

    async deleteLicense(productId, licenseid, userId) {
        const product = await this.getProduct(productId, userId);
        if (product) {
            return await this.licenseRepository.delete({ id: licenseid, productId: productId })
        } else {
            return null;
        }

    }

    async getProduct(id: number, userId: number): Promise<Product> {
        return await this.productRepository.findOne({ id: id, userId: userId });
    }

    async isOwner(productId: number, userId: number) {
        const product = await this.getProduct(productId, userId);
        if (product) {
            return product;
        }

        return false;
    }

    async getLicensesOfProduct(productId: number, userId: number, relations: boolean = false) {
        if (relations) {
            const data = await this.licenseRepository.find({
                relations: ['product', 'plugins', 'envato', 'licenseNumbers'],
                where: { product: { id: +productId, userId: +userId } }
            });
            return data;
        } else {
            return await this.licenseRepository.find({
                relations: ['product'],
                where: { product: { id: +productId, userId: +userId } }
            });
        }
    }


    async getLicense(licenseId: number, productId?: number, userId?: number) {
        return await this.licenseRepository.findOne({ id: licenseId });
    }

    async createLicensenumber(licenseId: number, ownerId: number, buyer: number, buyerEmail?: string, sendEmail?: boolean) {
        if (!ownerId || !licenseId) {
            throw {
                errorCode: LicenseErrorCode.DATA_PARAMS_MISSING
            }
        }
        // Check License and Ownership
        const license = await this.getLicense(licenseId);
        if (!license) {
            throw {
                errorCode: LicenseErrorCode.LICENSE_NOT_FOUND
            }
        }

        if (!this.isOwner(license.id, ownerId)) {
            throw {
                errorCode: LicenseErrorCode.LICENSE_NOT_OWNER
            }
        }

        let user = null;
        if (!buyer && !buyerEmail) {
            buyerEmail = platformEnvironment.defaultEmail;
        }

        if (buyerEmail) {
            user = await this.usersService.getUserByEmail(buyerEmail);
            if (!user) {
                user = await this.usersService.createUser(buyerEmail);
            }
        } else if (buyer >= 1) {
            user = await this.usersService.getUserById(+buyer);
        }

        if (!user) {
            throw {
                errorCode: AuthErrorCode.USER_NOT_EXIST
            }
        }

        const licensenumber = await new Licensenumber(user, license).save();

        if (sendEmail) {
            this.sendLicensenumber(user, licensenumber, license);
        }
        return licensenumber;

    }

    async checkLicensenumber(body: CheckLicenseNumberDto) {
        const licenseNumber = body.id;
        const url = body.url;
        const feature = body.feature;
        const envato = body.envato || false;
        const email = body.email || '';

        let checkingLicenseNumber = licenseNumber;
        if (envato) {
            const envatoCheck: any = await this.getEnvatoLicense(licenseNumber, email);
            if (envatoCheck.error) {
                return {
                    error: envatoCheck.error
                }
            } else if (!envatoCheck.licenseNumber) {
                throw {
                    errorCode: LicenseErrorCode.ENVATO_INVALID,
                    errorMessage: 'License could not verified'
                }
            } else {
                checkingLicenseNumber = envatoCheck.licenseNumber
            }
        }

        const data = await this.getLicenseNumber(checkingLicenseNumber, true);

        if (!data) {
            throw {
                errorCode: LicenseErrorCode.LICENSE_WRONG_ID
            }
        }

        if (data.status !== 'available') {
            throw {
                errorCode: LicenseErrorCode.LICENSE_NOT_AVAILABLE,
                errorMessage: data.status
            }
        }

        // Check features
        if (data.license.features && data.license.features.length > 0) {
            const featureCheck = data.license.features.some((element) => element === feature);
            if (!featureCheck) {
                throw {
                    errorCode: LicenseErrorCode.LICENSE_NO_FEATURE,
                    errorMessage: 'Not including in your license'
                }
            }
        }

        let research = {
            isValid: true,
            isSupport: true,
            urlIncluded: false
        }

        const alreadyIncluded = data.url.some((element) => element === url);
        if (alreadyIncluded) {
            research.urlIncluded = true;
        }

        if (data.activatedOn !== null) {
            const today = new Date();
            if (today > data.validUntil) research.isValid = false;
            if (today > data.supportUntil) research.isSupport = false;
        }

        return {
            data: data,
            research: research
        }

    }


    async addUrlToLicensenumber(body: CheckLicenseNumberDto) {
        const licenseCheck = await this.checkLicensenumber(body);

        if (licenseCheck.error) {
            return licenseCheck;
        }


        if (!licenseCheck.research.isValid) {
            throw {
                errorCode: LicenseErrorCode.LICENSE_NOT_VALID,
                errorMessage: licenseCheck.data.validUntil
            }
        }

        const data = licenseCheck.data;

        // Check URLs
        const alreadyIncluded = data.url.some((element) => element === body.url)

        if (!alreadyIncluded) {
            // Check volume
            const volume = data.license.volume;
            if (volume > 0) {
                if (volume <= data.url.length) {
                    throw {
                        errorCode: LicenseErrorCode.LICENSE_LIMIT_REACHED,
                        errorMessage: volume
                    }
                }
            }

            data.url.push(body.url);
        }

        if (data.activatedOn === null) {
            const validTime = data.license.validTime;

            data.activatedOn = new Date();
            const one_day = 1000 * 60 * 60 * 24;
            if (validTime <= 0) {
                data.validUntil = new Date('9999-12-31');
            } else {
                data.validUntil = new Date(data.activatedOn.getTime() + (validTime * one_day));
            }

            const supportTime = data.license.supportTime;
            if (supportTime <= 0) {
                data.supportUntil = new Date('9999-12-31');
            } else {
                data.supportUntil = new Date(data.activatedOn.getTime() + (supportTime * one_day));
            }
        }

        const r = await data.save();

        return {
            ...r,
            research: licenseCheck.research
        }
    }

    async getLicenseNumber(id, relations: boolean = false) {
        let options = {};
        if (relations) options = { relations: ['license'] };

        return await this.licensenumberRepository.findOne({
            ...options,
            where: { id }
        });
    }

    async getEnvatoDetails(licenseNumber) {
        const api = 'https://api.envato.com/v3/market/author/sale';
        const res = await axios.get(api + '?code=' + licenseNumber, {
            headers: { Authorization: 'Bearer Q4DpfHeuG0mTdkZsQdoysvVcFI4mySMc' },
        });

        if (res && res.data && res.data.item && res.data.item.id && res.data.sold_at) {
            const data = res.data;

            return {
                soldAt: data.sold_at,
                supportUntil: data.supported_until,
                license: data.license,
                itemId: data.item.id
            };
        } else {
            throw {
                errorCode: LicenseErrorCode.ENVATO_INVALID,
            }
        }
    }

    async getEnvatoLicense(licenseNumber, email) {
        const envatoDetails = await this.getEnvatoDetails(licenseNumber);

        // Check if Envato License already in use - if so, return licenseNumber directly from Database
        const envato = await this.findEnvatoLicense(licenseNumber);
        if (envato) {
            return {
                licenseNumber: envato.id
            }
        }

        if (!email) {
            email = platformEnvironment.defaultEmail
        }

        // License not in Database, check email
        let account = await this.usersService.getUserByEmail(email);

        // If no user with this email, create an account with email
        if (!account) {
            account = await this.usersService.createUser(email);
        }

        // Get License id from Envatoitem
        const envatoItem = await this.envatoRepository.findOne({ relations: ['license'], where: { id: envatoDetails.itemId } })
        if (!envatoItem) {
            throw {
                errorCode: LicenseErrorCode.ENVATO_NO_ITEM,
            }
        }

        // Create Licensenumber for licenseId
        const licensenumber = new Licensenumber(account, envatoItem.license);
        licensenumber.supportUntil = envatoDetails.supportUntil;
        const saved = await licensenumber.save();

        // Return licenseId
        return {
            licenseNumber: saved.id
        }
    }

    async findEnvatoLicense(envatoId) {
        return await this.licensenumberRepository.findOne({ envatoId: envatoId });
    }

    async updateWpPluginLicense(productId, licenseId, body, userId) {
        const product = await this.isOwner(productId, userId);
        if (!body.slug) {
            throw {
                errorCode: LicenseErrorCode.DATA_PARAMS_MISSING,
            }
        }
        if (!product) {
            throw {
                errorCode: LicenseErrorCode.NO_PRODUCT,
            }
        }

        const license = await this.licenseRepository.findOne({
            relations: ['plugins'],
            where: { id: licenseId }
        });

        if (!license) {
            throw {
                errorCode: LicenseErrorCode.LICENSE_NOT_FOUND,
            }
        }

        const plugin = await this.wpPluginRepository.findOne({ slug: body.slug });
        if (!plugin) {
            throw {
                errorCode: LicenseErrorCode.PLUGIN_NOT_FOUND,
            }
        }

        const index = license.plugins.findIndex(element => element.slug === body.slug);

        if (index >= 0) {
            // Plugin includes - remove it
            license.plugins.splice(index, 1);
        } else {
            // Plugin not includes - add it
            license.plugins.push(plugin);
        }
        return await license.save();
    }

    async createEnvatoItem(licenseId: number, body: CreateEnvatoItemDto, user) {
        if (!body || (!body.name || !body.id || !body.type)) {
            throw {
                errorCode: LicenseErrorCode.DATA_PARAMS_MISSING,
            }
        }

        const license = await this.getLicense(licenseId);

        if (!license) {
            throw {
                errorCode: LicenseErrorCode.LICENSE_NOT_FOUND,
            }
        }

        return await new EnvatoItem(+body.id, body.name, body.type, license).save();
    }


    async sendLicensenumber(user: Users, licensenumber: Licensenumber, license: License) {
        //console.log('Send License Number', user, licensenumber)

        const userMail: UserMail = {
            email: user.email,
            name: user.name,
            verified: user.verified,
            notify: user.verified,
        }

        let template = `<p>Hallo %NAME%,</p><p>mit dieser Email senden wir dir die Lizenznummer zu.</p><p>Die Lizenznummer lautet: %LICENSENUMBER%</p>`;

        if(!userMail.verified) {
            template += `<p>Bitte verifiziere deine Email-Adresse, sodass wir dich bei Updates rund um deine Lizenz informieren können!</p>`;
        }

        template += ` <p>Freundliche Grüße<br />%AUTHOR_NAME%</p>`;

        template = template.replace('%NAME%', user.name ? user.name : '');
        template = template.replace('%LICENSENUMBER%', licensenumber.id);
        template = template.replace('%AUTHOR_NAME%', 'Der Entwickler');
        this.mailer.sendMail(user.email, 'Deine Lizenznummer', template);
    }
}

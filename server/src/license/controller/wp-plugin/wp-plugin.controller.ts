import { WpPlugin } from './../../interfaces/wp-plugin.entity';
import { Licensenumber } from './../../interfaces/licensenumber.entity';
import { LicenseService } from './../../services/license.service';
import { WpPluginService } from './../../services/wp-plugin.service';
import { Controller, Get, Req, Body, Param, Res, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../../users/guards/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../users/guards/roles.guard';
import { Users } from '../../../users/interfaces/users.entity';
import { CreatePluginDto, AddLicenseToPluginDto, UpdateWpPluginDto } from '../../interfaces/wp-plugin.dto';
import { ResponseSuccess, ResponseError } from '../../../common/interfaces/response.interface';
import { LicenseErrorCode } from '../../../common/interfaces/license.error.code';

@Controller('wp-plugin')
export class WpPluginController {

    constructor(
        private readonly wpPluginService: WpPluginService,
        private readonly licenseService: LicenseService,
    ) { }

    @Get(':id/check/:license')
    async getWpPlugin(@Res() res, @Param() params) {
        try {
            const slug = params.id;
            const licenseKey = params.license;

            if (!slug || !licenseKey) {
                return res.status(HttpStatus.NOT_FOUND).json(new ResponseError(LicenseErrorCode.DATA_PARAMS_MISSING));
            }

            const licensenumber: Licensenumber = await this.licenseService.getLicenseNumber(licenseKey);
            const today = new Date();

            if (!licensenumber || !licensenumber.licenseId || licensenumber.supportUntil < today) {
                return res.status(HttpStatus.FORBIDDEN).json(new ResponseError(LicenseErrorCode.LICENSE_NO_SUPPORT));
            }

            const plugin: WpPlugin = await this.wpPluginService.getPlugin(slug, true);
            const contains = plugin.licenses.some((element) => element.id === licensenumber.licenseId);

            if (!contains) {
                return res.status(HttpStatus.NOT_FOUND).json(new ResponseError(LicenseErrorCode.LICENSE_NOT_VALID));
            }

            return res.status(HttpStatus.OK).json({
                "name": plugin.name,
                "version": plugin.version,
                "download_url": plugin.downloadUrl,
                "sections": {
                    "description": plugin.description,
                    "changelog": plugin.changelog
                },
                "homepage": plugin.homepage,
                "requires": plugin.requires,
                "tested": plugin.tested,
                "last_updated": plugin.lastUpdated,
                "author": plugin.author,
                "author_homepage": plugin.authorHomepage
            });
        } catch (error) {
            return new ResponseError(LicenseErrorCode.FAILED, null, error);
        }
    }


    // Create new WordPress Plugin
    @Get('list')
    @Roles('vendor')
    @UseGuards(AuthGuard('mip', {
        session: true
    }), RolesGuard)
    async getPlugins(@Req() req) {
        try {
            const user: Users = req.user;
            const plugin: any = await this.wpPluginService.getPlugins(user);
            return new ResponseSuccess(plugin);
        } catch (error) {
            return new ResponseError(LicenseErrorCode.FAILED, null, error);
        }
    }

    // Create new WordPress Plugin
    @Post('new')
    @Roles('vendor')
    @UseGuards(AuthGuard('mip', {
        session: true
    }), RolesGuard)
    async createPlugin(@Req() req, @Body() body: CreatePluginDto) {
        try {
            const user: Users = req.user;
            const plugin: any = await this.wpPluginService.createPlugin(body, user);
            return new ResponseSuccess(plugin);
        } catch (error) {
            return new ResponseError(LicenseErrorCode.FAILED, null, error);
        }
    }

    // Add Licenses to WordPress Plugin
    @Post(':id/license/add')
    @Roles('vendor')
    @UseGuards(AuthGuard('mip', {
        session: true
    }), RolesGuard)
    async addLicense(@Req() req, @Body() body: AddLicenseToPluginDto, @Param() params) {
        try {
            const license: any = await this.wpPluginService.addLicense(params.id, +body.licenseId, req.user.id);
            return new ResponseSuccess(license);
        } catch (error) {
            return new ResponseError(LicenseErrorCode.FAILED, null, error);
        }
    }

    // Update WordPress Plugin
    @Post(':id/update')
    @Roles('vendor')
    @UseGuards(AuthGuard('mip', {
        session: true
    }), RolesGuard)
    async updatePlugin(@Req() req, @Body() body: UpdateWpPluginDto, @Param() params) {
        try {
            const plugin: any = await this.wpPluginService.updatePlugin(params.id, body, req.user.id);
            return new ResponseSuccess(plugin);
        } catch (error) {
            return new ResponseError(LicenseErrorCode.FAILED, null, error);
        }
    }

    // Delete WordPress Plugin
    @Get(':id/delete')
    @Roles('vendor')
    @UseGuards(AuthGuard('mip', {
        session: true
    }), RolesGuard)
    async deletePlugin(@Req() req, @Param() params) {
        try {
            const plugin: any = await this.wpPluginService.deletePlugin(params.id, req.user.id);
            return new ResponseSuccess(plugin);
        } catch (error) {
            return new ResponseError(LicenseErrorCode.FAILED, null, error);
        }
    }

}

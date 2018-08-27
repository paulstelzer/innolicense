import { ResponseSuccess } from './../../../common/interfaces/response.interface';
import { Controller, Post, Req, UseGuards, Body, Param } from '@nestjs/common';
import { LicenseService } from '../../services/license.service';
import { Roles } from '../../../users/guards/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Users } from '../../../users/interfaces/users.entity';
import { CreateNewLicensenumberDto, CheckLicenseNumberDto } from '../../interfaces/license.dto';
import { ApiUseTags } from '@nestjs/swagger';
import { RolesGuard } from '../../../users/guards/roles.guard';
import { CreateEnvatoItemDto } from '../../interfaces/wp-plugin.dto';
import { ResponseError } from '../../../common/interfaces/response.interface';
import { LicenseErrorCode } from '../../../common/interfaces/license.error.code';

@Controller('license')
export class LicenseController {
  constructor(
    private readonly licenseService: LicenseService
  ) { }


  @ApiUseTags('license')
  @Post(':id/new')
  @Roles('vendor')
  @UseGuards(AuthGuard('mip', {
    session: true
  }))
  async createNewLicensenumber(@Req() req, @Body() body: CreateNewLicensenumberDto, @Param() params) {
    try {
      const user: Users = req.user;
      const buyer = +body.buyer;
      const buyerEmail = body.buyerEmail;
      const sendEmail = body.sendEmail ? body.sendEmail : false;
      const licenseNumber: any = await this.licenseService.createLicensenumber(params.id, user.id, buyer, buyerEmail, sendEmail);
      return new ResponseSuccess(licenseNumber);
    } catch (error) {
      return new ResponseError(LicenseErrorCode.FAILED, null, error);
    }
  }

  @ApiUseTags('license')
  @Post('action')
  async checkLicensenumber(@Body() body: CheckLicenseNumberDto) {
    try {
      let message: any = {};
      if (!body.id) {
        return new ResponseError(LicenseErrorCode.DATA_PARAMS_MISSING);
      }
      switch (body.action) {
        case 'check':
          message = await this.licenseService.checkLicensenumber(body);
          break;
        case 'remove':
          // TODO
          break;
        case 'add':
          message = await this.licenseService.addUrlToLicensenumber(body);
          break;
      }

      return new ResponseSuccess(message);
    } catch (error) {
      console.log(error);
      return new ResponseError(LicenseErrorCode.FAILED, null, error);
    }
  }

  // Create new Envato Item
  @Post(':id/envato')
  @Roles('vendor')
  @UseGuards(AuthGuard('mip', {
    session: true
  }), RolesGuard)
  async createEnvatoItem(@Req() req, @Body() body: CreateEnvatoItemDto, @Param() params) {
    try {
      const user: Users = req.user;
      const licenseId = +params.id;
      const plugin: any = await this.licenseService.createEnvatoItem(licenseId, body, user);

      return new ResponseSuccess(plugin);
    } catch (error) {
      return new ResponseError(LicenseErrorCode.FAILED, null, error);
    }
  }

}

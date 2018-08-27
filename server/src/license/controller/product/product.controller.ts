import { LicenseService } from './../../services/license.service';
import { RolesGuard } from './../../../users/guards/roles.guard';
import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../users/guards/roles.decorator';
import { Product } from '../../interfaces/product.entity';
import { License } from '../../interfaces/license.entity';
import { CreateLicenseDto } from '../../interfaces/license.dto';
import { NewProductDto } from '../../interfaces/product.dto';
import { Users } from '../../../users/interfaces/users.entity';
import { ResponseSuccess, ResponseError } from '../../../common/interfaces/response.interface';
import { LicenseErrorCode } from '../../../common/interfaces/license.error.code';


@Controller('product')
export class ProductController {
  constructor(
    private readonly licenseService: LicenseService
  ) { }

  @Get('list')
  @Roles('vendor')
  @UseGuards(AuthGuard('mip', {
    session: true
  }), RolesGuard)
  async getProducts(@Req() req) {
    try {
      const user: Users = req.user;
      const products = await this.licenseService.getProducts(user.id);

      return new ResponseSuccess(products);
    } catch (error) {
      return new ResponseError(LicenseErrorCode.FAILED, null, error);
    }
  }

  @Post('new')
  @Roles('vendor')
  @UseGuards(AuthGuard('mip', {
    session: true
  }), RolesGuard)
  async createProduct(@Req() req, @Body() body: NewProductDto) {
    try {
      const user: Users = req.user;
      const product = await new Product(body.name, user).save();


      return new ResponseSuccess({
        id: product.id,
        secretKey: product.secretKey
      });
    } catch (error) {
      return new ResponseError(LicenseErrorCode.FAILED, null, error);
    }
  }


  @Get(':id/licenses')
  @Roles('vendor')
  @UseGuards(AuthGuard('mip', {
    session: true
  }))
  async getLicenses(@Req() req, @Param() params) {
    try {
      const user: Users = req.user;
      const licenses = await this.licenseService.getLicensesOfProduct(+params.id, +user.id, true);
      return new ResponseSuccess(licenses);
    } catch (error) {
      return new ResponseError(LicenseErrorCode.FAILED, null, error);
    }
  }

  @Get(':id/delete')
  @Roles('vendor')
  @UseGuards(AuthGuard('mip', {
    session: true
  }))
  async deleteProduct(@Req() req, @Param() params) {
    const user: Users = req.user;
    try {
      const product = await this.licenseService.deleteProduct(params.id, user.id);
      return new ResponseSuccess(product);
    } catch (error) {
      return new ResponseError(LicenseErrorCode.FAILED, null, error);
    }
  }


  @Post(':id/licenses/add')
  @Roles('vendor')
  @UseGuards(AuthGuard('mip', {
    session: true
  }))
  async createLicense(@Req() req, @Body() body: CreateLicenseDto, @Param() params) {
    const user: Users = req.user;

    try {
      if (!body.name && !body.features) {
        return new ResponseError(LicenseErrorCode.DATA_PARAMS_MISSING);
      }

      const product = await this.licenseService.getProduct(params.id, user.id);

      if (!product) {
        return new ResponseError(LicenseErrorCode.NO_PRODUCT);
      }

      let volume = +body.volume;
      if (!volume) {
        volume = 0;
      }

      let validTime = +body.validTime;
      if (!validTime) {
        validTime = 0;
      }

      let supportTime = +body.supportTime;
      if (!supportTime) {
        supportTime = 0;
      }

      const license = await new License(product, body.name, volume, validTime, supportTime, body.features).save();
      return new ResponseSuccess({ id: license.id });
    } catch (error) {
      return new ResponseError(LicenseErrorCode.FAILED, null, error);
    }
  }

  @Get(':id/licenses/:licenseid/delete')
  @Roles('vendor')
  @UseGuards(AuthGuard('mip', {
    session: true
  }))
  async deleteLicense(@Req() req, @Param() params) {
    const user: Users = req.user;
    try {
      const product = await this.licenseService.deleteLicense(+params.id, +params.licenseid, user.id);
      return new ResponseSuccess(product);
    } catch (error) {
      return new ResponseError(LicenseErrorCode.FAILED, null, error);
    }
  }

  // Update License
  @Post(':id/licenses/:licenseid/update')
  @Roles('vendor')
  @UseGuards(AuthGuard('mip', {
    session: true
  }), RolesGuard)
  async updatePlugin(@Req() req, @Body() body, @Param() params) {
    try {
      const plugin: any = await this.licenseService.updateLicense(+params.id, +params.licenseid, body, req.user.id);
      return new ResponseSuccess(plugin);
    } catch (error) {
      return new ResponseError(LicenseErrorCode.FAILED, null, error);
    }
  }

  // Add or Remove Plugin from License
  @Post(':id/licenses/:licenseid/add-plugin')
  @Roles('vendor')
  @UseGuards(AuthGuard('mip', {
    session: true
  }), RolesGuard)
  async updateWpPluginLicense(@Req() req, @Body() body, @Param() params) {
    try {
      const plugin: any = await this.licenseService.updateWpPluginLicense(+params.id, +params.licenseid, body, req.user.id);
      return new ResponseSuccess(plugin);
    } catch (error) {
      return new ResponseError(LicenseErrorCode.FAILED, null, error);
    }
  }

}

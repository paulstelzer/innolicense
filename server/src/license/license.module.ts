
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { UsersModule } from './../users/users.module';
import { NodemailerModule } from './../nodemailer/nodemailer.module';

// Services
import { LicenseService } from './services/license.service';
//import { FilesService } from './services/files.service';
import { WpPluginService } from './services/wp-plugin.service';

// Controller
import { LicenseController } from './controller/license/license.controller';
import { ProductController } from './controller/product/product.controller';
//import { FileController } from './controller/file/file.controller';
import { WpPluginController } from './controller/wp-plugin/wp-plugin.controller';

// Interfaces
//import { Files } from './interfaces/files.entity';
import { Product } from './interfaces/product.entity';
import { License } from './interfaces/license.entity';
import { Licensenumber } from './interfaces/licensenumber.entity';
import { WpPlugin } from './interfaces/wp-plugin.entity';
import { EnvatoItem } from './interfaces/envato-item.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Product, License, Licensenumber, WpPlugin, EnvatoItem]),
    NodemailerModule
  ],
  controllers: [
    LicenseController,
    ProductController,
    WpPluginController
  ],
  providers: [
    LicenseService,
    WpPluginService
  ],
  exports: [

  ],
})
export class LicenseModule { }

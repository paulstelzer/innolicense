import { Test, TestingModule } from '@nestjs/testing';
import { LicenseService } from './license.service';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { UsersModule } from '../../users/users.module';
import { NodemailerModule } from '../../nodemailer/nodemailer.module';

// Services
import { WpPluginService } from './wp-plugin.service';

// Controller
import { LicenseController } from '../controller/license/license.controller';
import { ProductController } from '../controller/product/product.controller';
//import { FileController } from '../controller/file/file.controller';
import { WpPluginController } from '../controller/wp-plugin/wp-plugin.controller';

// Interfaces
//import { Files } from './interfaces/files.entity';
import { Product } from '../interfaces/product.entity';
import { License } from '../interfaces/license.entity';
import { Licensenumber } from '../interfaces/licensenumber.entity';
import { WpPlugin } from '../interfaces/wp-plugin.entity';
import { EnvatoItem } from '../interfaces/envato-item.entity';
import { } from 'ts-jest';

describe('LicenseService', () => {
  let service: LicenseService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();
    service = module.get<LicenseService>(LicenseService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

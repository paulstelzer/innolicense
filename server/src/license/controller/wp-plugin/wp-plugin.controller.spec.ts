import { Test, TestingModule } from '@nestjs/testing';
import { WpPluginController } from './wp-plugin.controller';
import { LicenseService } from '../../services/license.service';
import { WpPluginService } from '../../services/wp-plugin.service';

describe('WpPlugin Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [WpPluginController],
      providers: [
        LicenseService,
        WpPluginService
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: WpPluginController = module.get<WpPluginController>(WpPluginController);
    expect(controller).toBeDefined();
  });
});

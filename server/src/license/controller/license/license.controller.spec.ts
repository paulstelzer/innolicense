import { Test, TestingModule } from '@nestjs/testing';
import { LicenseController } from './license.controller';
import { LicenseService } from '../../services/license.service';

describe('License Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [LicenseController],
      providers: [
        LicenseService,
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: LicenseController = module.get<LicenseController>(LicenseController);
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { LicenseService } from '../../services/license.service';

describe('Product Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        LicenseService,
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: ProductController = module.get<ProductController>(ProductController);
    expect(controller).toBeDefined();
  });
});

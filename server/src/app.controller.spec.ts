import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { platformEnvironment } from './constants';
import { } from 'ts-jest';


describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [],
      controllers: [AppController],
      providers: [],
    }).compile();
  });

  describe('root', () => {
    it('should return version', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.root()).toEqual({
        version: `${platformEnvironment.version}`,
      });
    });
  });
});

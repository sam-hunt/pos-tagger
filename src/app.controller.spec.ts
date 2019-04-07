import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return a message including "Welcome to the Parts-of-Speech Tagger Service"', () => {
      expect(appController.getHello()).toMatch('Welcome to the Part-of-Speech Tagger Service');
    });

    it('should return a message including a link to the swagger API documentation', () => {
      expect(appController.getHello()).toMatch('<a href="/docs">');
    });
  });
});

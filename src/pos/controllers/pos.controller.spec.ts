import { Test, TestingModule } from '@nestjs/testing';
import { PosController } from './pos.controller';
import { PosNameService } from '../services/pos-name.service';
import { PosTaggerService } from '../services/pos-tagger.service';

describe('PosController', () => {
    let controller: PosController;
    let nameService: PosNameService;
    let taggerService: PosTaggerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PosController],
            providers: [PosNameService, PosTaggerService],
        }).compile();

        controller = module.get<PosController>(PosController);
        nameService = module.get<PosNameService>(PosNameService);
        taggerService = module.get<PosTaggerService>(PosTaggerService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('Part-of-speech Names', () => {
        it('should define a method "getPosNames"', () => {
            expect(controller.getPosNames).toBeDefined();
        });

        it('should call "getPosNames" on the PosNameService', () => {
            const result = [{ token: 'TEST', description: 'test' }];
            jest.spyOn(nameService, 'getPosNames').mockImplementation(() => result);
            expect(controller.getPosNames()).toBe(result);
            expect(nameService.getPosNames).toHaveBeenCalled();
        });
    });

    describe('Part-of-speech Tagger', () => {

        describe('Inline string tagger', () => {
            it('should define a method "tagTextWithPosInline"', () => {
                expect(controller.tagTextWithPosInline).toBeDefined();
            });

            it('should call "tagTextWithPosInline" on the PosTaggerService', () => {
                const result = 'Hello_UH';
                jest.spyOn(taggerService, 'tagTextWithPosInline').mockImplementation(() => result);
                expect(controller.tagTextWithPosInline()).toBe(result);
                expect(taggerService.tagTextWithPosInline).toHaveBeenCalled();
            });
        });

        describe('json object response tagger', () => {
            it('should define a method "tagTextWithPos"', () => {
                expect(controller.tagTextWithPos).toBeDefined();
            });

            it('should call "tagTextWithPos" on the PosTaggerService', () => {
                const result = {};
                jest.spyOn(taggerService, 'tagTextWithPos').mockImplementation(() => result);
                expect(controller.tagTextWithPos()).toBe(result);
                expect(taggerService.tagTextWithPos).toHaveBeenCalled();
            });
        });

        describe('json object response tagger with lemmatisation', () => {
            it('should define a method "tagTextWithPosAndLemmatize"', () => {
                expect(controller.tagTextWithPosAndLemmatize).toBeDefined();
            });

            it('should call "tagTextWithPosAndLemmatize" on the PosTaggerService', () => {
                const result = {};
                jest.spyOn(taggerService, 'tagTextWithPosAndLemmatize').mockImplementation(() => result);
                expect(controller.tagTextWithPosAndLemmatize()).toBe(result);
                expect(taggerService.tagTextWithPosAndLemmatize).toHaveBeenCalled();
            });
        });
    });
});

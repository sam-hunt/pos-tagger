import { Test, TestingModule } from '@nestjs/testing';
import { PosController } from './pos.controller';
import { PosTaggerService } from '../services/pos-tagger.service';

describe('PosController', () => {
    let controller: PosController;
    let taggerService: PosTaggerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PosController],
            providers: [PosTaggerService],
        }).compile();

        controller = module.get<PosController>(PosController);
        taggerService = module.get<PosTaggerService>(PosTaggerService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('Part-of-speech Definitions', () => {
        it('should define a method "getPosDefs"', () => {
            expect(controller.getPosDefs).toBeDefined();
        });

        it('should call "getPosDefs" on the PosTaggerService', async () => {
            const result = [{ token: 'TEST', description: 'test' }];
            jest.spyOn(taggerService, 'getPosDefs').mockImplementation(async () => result);
            expect(await controller.getPosDefs()).toBe(result);
            expect(taggerService.getPosDefs).toHaveBeenCalled();
        });
    });

    describe('Part-of-speech Tagger', () => {

        describe('Json object response tagger with lemmatisation', () => {
            it('should define a method "tagSentences"', () => {
                expect(controller.tagSentences).toBeDefined();
            });

            it('should call "tag" on the PosTaggerService', async () => {
                const result = [];
                jest.spyOn(taggerService, 'tagSentences').mockImplementation(async () => result);
                expect(await controller.tagSentences('Hello')).toBe(result);
                expect(taggerService.tagSentences).toHaveBeenCalled();
            });
        });
    });
});

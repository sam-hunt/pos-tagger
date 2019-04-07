import { Test, TestingModule } from '@nestjs/testing';
import { PosTaggerService } from './pos-tagger.service';

describe('PosTaggerService', () => {
    let service: PosTaggerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PosTaggerService],
        }).compile();

        service = module.get<PosTaggerService>(PosTaggerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should define a method called "tagTextWithPos"', () => {
        expect(service.tagTextWithPos).toBeDefined();
    });

    describe('Inline string tagging', () => {
        it('should define a method called "tagTextWithPosInline"', () => {
            expect(service.tagTextWithPosInline).toBeDefined();
        });

        it('should accept and return a string value', async () => {
            expect(typeof await service.tagTextWithPosInline('Hello')).toBe('string');
        });

        it('should correctly append the part-of-speech token', async () => {
            expect(await service.tagTextWithPosInline('Hello')).toBe('Hello_UH');
        });
    });

    it('should define a method called "tagTextWithPosAndLemmatize"', () => {
        expect(service.tagTextWithPosAndLemmatize).toBeDefined();
    });
});

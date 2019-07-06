import { Test, TestingModule } from '@nestjs/testing';
import { PosTaggerService } from './pos-tagger.service';
import { plainToClass } from 'class-transformer';
import { TokenDescription } from '../models/token-description.class';

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

    describe('Naming', () => {
        it('should define a method called "getPosDefs"', () => {
            expect(service.getPosDefs).toBeDefined();
        });

        it('should get a list of part-of-speech names from "getPosDefs"', async () => {
            const result = await service.getPosDefs();
            expect(result).toBeInstanceOf(Array);
            result.forEach(r => expect(r).toBeInstanceOf(TokenDescription));
        });

        it('should return a part-of-speech for known tokens', async () => {
            const result = await service.getPosDefs();
            const knownTokens = ['CC', 'CD', 'DT', 'EX', 'FW', 'IN', 'JJ', 'JJR', 'JJS', 'LS', 'MD', 'NN', 'NNS', 'NP', 'NPS', 'PDT', 'POS', 'PP',
                'PP', 'RB', 'RBR', 'RBS', 'RP', 'SENT', 'SYM', 'TO', 'UH', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ', 'VH', 'VHD', 'VHG', 'VHN',
                'VHP', 'VHZ', 'VV', 'VVD', 'VVG', 'VVN', 'VVP', 'VVZ', 'WDT', 'WP'];
            knownTokens.forEach(token => {
                expect(result.find(tokenDescription => tokenDescription.token === token)).toBeTruthy();
            });
        });
    });

    describe('Tagging', () => {
        it('should define a method called "tagSentences"', () => {
            expect(service.tagSentences).toBeDefined();
        });

        xit('should correctly append the part-of-speech token', async () => {
            // const expectedWord: TaggedWord = plainToClass(TaggedWord, { lemma: 'hello', pos: 'UH', word: 'Hello' });
            // const expectedSentence: TaggedSentence = plainToClass(TaggedSentence, { words: [expectedWord] });
            // expect(await service.tagSentences('Hello')).toEqual([expectedSentence]);
        });
    });
});

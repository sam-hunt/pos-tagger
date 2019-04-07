import { Test, TestingModule } from '@nestjs/testing';
import { PosNameService } from './pos-name.service';
import { PosName } from '../classes/pos-name.class';

describe('PosNameService', () => {
    let service: PosNameService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PosNameService],
        }).compile();

        service = module.get<PosNameService>(PosNameService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should define a method called "getPosNames"', () => {
        expect(service.getPosNames).toBeDefined();
    });

    it('should get a list of part-of-speech names from "getPosNames"', () => {
        const result = service.getPosNames();
        expect(result).toBeInstanceOf(Array);
        result.forEach(r => expect(r).toBeInstanceOf(PosName));
    });

    it('should return a part-of-speech for known tokens', () => {
        const result = service.getPosNames();
        const knownTokens = ['CC', 'CD', 'DT', 'EX', 'FW', 'IN', 'JJ', 'JJR', 'JJS', 'LS', 'MD', 'NN', 'NNS', 'NP', 'NPS', 'PDT', 'POS', 'PP', 'PP',
        'RB', 'RBR', 'RBS', 'RP', 'SENT', 'SYM', 'TO', 'UH', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ', 'VH', 'VHD', 'VHG', 'VHN', 'VHP', 'VHZ', 'VV',
        'VVD', 'VVG', 'VVN', 'VVP', 'VVZ', 'WDT', 'WP'];
        knownTokens.forEach(token => {
            expect(result.find(posName => posName.token === token)).toBeTruthy();
        });
    });
});

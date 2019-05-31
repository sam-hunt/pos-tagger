import { Injectable, Logger } from '@nestjs/common';
import { PosTagger } from '../models/pos-tagger.class';
import { StanfordPosTagger } from '../models/stanford-pos-tagger.class';
import { TaggedSentence } from '../models/tagged-sentence.class';
import { plainToClass } from 'class-transformer';
import { PosName } from '../models/pos-name.class';

@Injectable()
export class PosTaggerService {
    private readonly logger = new Logger(PosTaggerService.name);

    private readonly posTagger: PosTagger = new StanfordPosTagger();
    private readonly posNames: PosName[] = [
        { token: 'CC', description: 'coordinating conjunction' },
        { token: 'CD', description: 'cardinal number' },
        { token: 'DT', description: 'determiner' },
        { token: 'EX', description: 'existential there' },
        { token: 'FW', description: 'foreign word' },
        { token: 'IN', description: 'preposition, subordinating conjunction' },
        { token: 'JJ', description: 'adjective' },
        { token: 'JJR', description: 'adjective, comparative' },
        { token: 'JJS', description: 'adjective, superlative' },
        { token: 'LS', description: 'list marker' },
        { token: 'MD', description: 'modal' },
        { token: 'NN', description: 'noun, singular or mass' },
        { token: 'NNS', description: 'noun plural' },
        { token: 'NNP', description: 'proper noun, singular' },
        { token: 'NPS', description: 'proper noun, plural' },
        { token: 'PDT', description: 'predeterminer' },
        { token: 'POS', description: 'possessive ending' },
        { token: 'PRP', description: 'personal pronoun' },
        { token: 'PP$', description: 'possessive pronoun' },
        { token: 'RB', description: 'adverb' },
        { token: 'RBR', description: 'adverb, comparative' },
        { token: 'RBS', description: 'adverb, superlative' },
        { token: 'RP', description: 'particle' },
        { token: 'SENT', description: 'Sentence-break punctuation' },
        { token: 'SYM', description: 'Symbol' },
        { token: 'TO', description: 'infinitive ‘to’' },
        { token: 'UH', description: 'interjection' },
        { token: 'VB', description: 'verb be, base form' },
        { token: 'VBD', description: 'verb be, past tense' },
        { token: 'VBG', description: 'verb be, gerund/present participle' },
        { token: 'VBN', description: 'verb be, past participle' },
        { token: 'VBP', description: 'verb be, sing. present, non-3d' },
        { token: 'VBZ', description: 'verb be, 3rd person sing. present' },
        { token: 'VH', description: 'verb have, base form' },
        { token: 'VHD', description: 'verb have, past tense' },
        { token: 'VHG', description: 'verb have, gerund/present participle' },
        { token: 'VHN', description: 'verb have, past participle' },
        { token: 'VHP', description: 'verb have, sing. present, non-3d' },
        { token: 'VHZ', description: 'verb have, 3rd person sing. present' },
        { token: 'VV', description: 'verb, base form' },
        { token: 'VVD', description: 'verb, past tense' },
        { token: 'VVG', description: 'verb, gerund/present participle' },
        { token: 'VVN', description: 'verb, past participle' },
        { token: 'VVP', description: 'verb, sing. present, non-3d' },
        { token: 'VVZ', description: 'verb, 3rd person sing. present' },
        { token: 'WDT', description: 'wh-determiner' },
        { token: 'WP', description: 'wh-pronoun' },
        { token: 'WP$', description: 'possessive wh-pronoun' },
        { token: 'WRB', description: 'wh-abverb' },
        { token: '#', description: '#' },
        { token: '$', description: '$' },
        { token: '“', description: 'Quotation marks' },
        { token: '``', description: 'Opening quotation marks' },
        { token: '\'\'', description: 'Closing quotation marks' },
        { token: '-LRB-', description: 'Open parenthesis' },
        { token: '-RRB-', description: 'Close parenthesis' },
        { token: ',', description: 'Comma' },
        { token: ':', description: 'Punctuation' },
        { token: '.', description: 'Terminating punctuation (!, ., ?) '},
    ].map(obj => plainToClass(PosName, obj));

    public async getPosDefs(): Promise<PosName[]> {
        return this.posNames;
    }

    public async tagSentences(sentences: string): Promise<TaggedSentence[]> {
        return await this.posTagger.tag(sentences);
    }
}

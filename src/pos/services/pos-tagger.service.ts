import { Injectable, Logger } from '@nestjs/common';
import Axios, { AxiosResponse } from 'axios';

import { TaggerResult } from '../models/tagger-result.class';
import { TokenDescription } from '../models/token-description.class';
import { tokenDescriptions } from '../models/token-descriptions';

@Injectable()
export class PosTaggerService {
    private readonly logger = new Logger(PosTaggerService.name);
    private readonly taggerUrlRoot = 'http://localhost:9000/';

    public async getPosDefs(): Promise<TokenDescription[]> {
        return tokenDescriptions;
    }

    public async tagSentences(sentences: string, annotators: string): Promise<TaggerResult> {
        const properties: string = encodeURIComponent(JSON.stringify({
            annotators, outputFormat: 'json',
        }));
        const result: AxiosResponse<TaggerResult> = await Axios.post(`${this.taggerUrlRoot}?properties=${properties}`, sentences);

        if (result.data.sentences && annotators.split(',').includes('depparse')) {
            result.data.sentences.forEach(sentence => {
                delete sentence.enhancedDependencies;
                delete sentence.enhancedPlusPlusDependencies;
            });
        }

        // this.logger.debug(JSON.stringify(result.data, null, 0));

        return result.data;
    }
}

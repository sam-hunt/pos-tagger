import { Controller, Get, Post, Header, Logger, HttpCode, Query } from '@nestjs/common';
import { ApiOkResponse, ApiInternalServerErrorResponse, ApiOperation, ApiUseTags, ApiConsumes, ApiImplicitBody, ApiImplicitQuery,
    } from '@nestjs/swagger';
import { PlainBody } from '../decorators/plain-body.decorator';
import { performance } from 'perf_hooks';

import { PosTaggerService } from '../services/pos-tagger.service';
import { TaggerResult } from '../models/tagger-result.class';
import { TokenDescription } from '../models/token-description.class';
import { string } from 'prop-types';

@Controller('v1/pos')
export class PosController {
    private readonly logger = new Logger(PosController.name);

    constructor(
        private readonly posTaggerService: PosTaggerService,
    ) {}

    @Get('names')
    @Header('Content-Type', 'application/json')
    @ApiUseTags('pos-tagging')
    @ApiOperation({ title: 'List part-of-speech token descriptions' })
    @ApiOkResponse({ description: 'OK' })
    public async getPosDefs(): Promise<TokenDescription[]> {
        this.logger.log('Received request for part-of-speech descriptor array');
        return await this.posTaggerService.getPosDefs();
    }

    @Post('tag')
    @HttpCode(200)
    @ApiConsumes('text/plain')
    @ApiUseTags('pos-tagging')
    @ApiOperation({ title: 'Tag text with part-of-speech tokens and lemmatised word stems via JSON response' })
    @ApiImplicitQuery({
        name: 'annotators',
        description: 'Comma-separated list of annotators to pass through to the tagger e.g. tokenize,ssplit,truecase,pos,lemma,ner,depparse',
        type: string,
        required: false,
    })
    @ApiImplicitBody({ name: 'sentences', type: String })
    @ApiOkResponse({ description: 'Successfully tagged text', type: TaggerResult })
    @ApiInternalServerErrorResponse({ description: 'Annotation process failure' })
    public async tagSentences(
        @Query('annotators') annotators: string = 'tokenize,ssplit,truecase,pos,lemma,ner,depparse',
        @PlainBody() sentences: string,
    ): Promise<TaggerResult> {
        const startTime = performance.now();
        this.logger.log('Received request for annotations: ' + annotators.split(',').join(', '));
        const result = await this.posTaggerService.tagSentences(sentences, annotators);
        this.logger.log(`Annotated ${result.sentences ? result.sentences.length + ' sentences' : (result as any).tokens.length + ' tokens'} in ${
            Math.floor(performance.now() - startTime)}ms`);
        return result;
    }
}

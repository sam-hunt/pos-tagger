import { Controller, Get, Post, Body, Header, Logger, HttpCode } from '@nestjs/common';
import { ApiOkResponse, ApiInternalServerErrorResponse, ApiOperation, ApiUseTags, ApiConsumes, ApiImplicitBody } from '@nestjs/swagger';
import { PlainBody } from '../decorators/plain-body.decorator';

import { PosName } from '../models/pos-name.class';
import { TaggedSentence } from '../models/tagged-sentence.class';
import { PosTaggerService } from '../services/pos-tagger.service';

@Controller('pos')
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
    public async getPosDefs(): Promise<PosName[]> {
        this.logger.log('Received request for part-of-speech descriptor array');
        return await this.posTaggerService.getPosDefs();
    }

    @Post('tag')
    @HttpCode(200)
    @ApiConsumes('text/plain')
    @ApiUseTags('pos-tagging')
    @ApiOperation({ title: 'Tag text with part-of-speech tokens and lemmatised word stems via JSON response' })
    @ApiImplicitBody({ name: 'sentences', type: String })
    @ApiOkResponse({ description: 'Successfully tagged text', type: TaggedSentence, isArray: true })
    @ApiInternalServerErrorResponse({ description: 'Tagging process failure' })
    public async tagSentences(@PlainBody() sentences: string): Promise<TaggedSentence[]> {
        this.logger.log('Received request for part-of-speech tag with stems');
        return await this.posTaggerService.tagSentences(sentences);
    }
}

import { Controller, Get, Post, Body, Header } from '@nestjs/common';
import { PosNameService } from '../services/pos-name.service';
import { PosName } from '../classes/pos-name.class';
import { PosTaggerService } from '../services/pos-tagger.service';
import { ApiOkResponse, ApiInternalServerErrorResponse, ApiOperation, ApiUseTags, ApiConsumes } from '@nestjs/swagger';
import { PlainBody } from '../decorators/plain-body.decorator';

@Controller('pos')
export class PosController {
    constructor(
        private readonly posNameService: PosNameService,
        private readonly posTaggerService: PosTaggerService,
    ) {}

    @Get('names')
    @Header('Content-Type', 'application/json')
    @ApiUseTags('pos-names')
    @ApiOperation({ title: 'List part-of-speech token descriptions' })
    @ApiOkResponse({ description: 'OK' })
    public async getPosNames(): Promise<PosName[]> {
        return this.posNameService.getPosNames();
    }

    @Post('tag')
    @Header('Content-Type', 'application/json')
    @ApiConsumes('text/plain')
    @ApiUseTags('pos-tagging')
    @ApiOperation({ title: 'Tag text with part-of-speech tokens via JSON response' })
    @ApiOkResponse({ description: 'Successfully tagged text' })
    @ApiInternalServerErrorResponse({ description: 'Tagging process failure' })
    public async tagTextWithPos(@Body() text: string): Promise<unknown> {
        return this.posTaggerService.tagTextWithPos(text);
    }

    @Post('tag-inline')
    @Header('Content-Type', 'text/plain')
    @ApiConsumes('text/plain')
    @ApiUseTags('pos-tagging')
    @ApiOperation({ title: 'Tag text with inlined part-of-speech tokens via string response' })
    @ApiOkResponse({ description: 'Successfully tagged text' })
    @ApiInternalServerErrorResponse({ description: 'Tagging process failure' })
    public async tagTextWithPosInline(@PlainBody() text: string): Promise<string> {
        return this.posTaggerService.tagTextWithPosInline(text);
    }

    @Post('tag-with-stems')
    @Header('Content-Type', 'application/json')
    @ApiConsumes('text/plain')
    @ApiUseTags('pos-tagging')
    @ApiOperation({ title: 'Tag text with part-of-speech tokens and lemmatised word stems via JSON response' })
    @ApiOkResponse({ description: 'Successfully tagged text' })
    @ApiInternalServerErrorResponse({ description: 'Tagging process failure' })
    public async tagTextWithPosAndLemmatize(@Body() text: string): Promise<unknown> {
        return this.posTaggerService.tagTextWithPosAndLemmatize(text);
    }
}

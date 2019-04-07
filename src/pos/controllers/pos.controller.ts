import { Controller, Get, Post, Body } from '@nestjs/common';
import { PosNameService } from '../services/pos-name.service';
import { PosName } from '../classes/pos-name.class';
import { PosTaggerService } from '../services/pos-tagger.service';
import { ApiOkResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';

@Controller('pos')
export class PosController {

    constructor(
        private readonly posNameService: PosNameService,
        private readonly posTaggerService: PosTaggerService,
    ) {}

    @Get('names')
    @ApiOkResponse({ description: 'OK' })
    public getPosNames(): PosName[] {
        return this.posNameService.getPosNames();
    }

    @Post('tag')
    @ApiOkResponse({ description: 'Successfully tagged text' })
    @ApiInternalServerErrorResponse({ description: 'Tagging process failure' })
    public tagTextWithPos(@Body() text: string): unknown {
        return this.posTaggerService.tagTextWithPos(text);
    }

    @Post('tag-inline')
    @ApiOkResponse({ description: 'Successfully tagged text' })
    @ApiInternalServerErrorResponse({ description: 'Tagging process failure' })
    public tagTextWithPosInline(@Body() text: string): string {
        return this.posTaggerService.tagTextWithPosInline(text);
    }

    @Post('tag-with-stems')
    @ApiOkResponse({ description: 'Successfully tagged text' })
    @ApiInternalServerErrorResponse({ description: 'Tagging process failure' })
    public tagTextWithPosAndLemmatize(@Body() text: string): unknown {
        return this.posTaggerService.tagTextWithPosAndLemmatize(text);
    }
}

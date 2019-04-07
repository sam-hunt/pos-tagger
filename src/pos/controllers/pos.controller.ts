import { Controller, Get, Post } from '@nestjs/common';
import { PosNameService } from '../services/pos-name.service';
import { PosName } from '../classes/pos-name.class';
import { PosTaggerService } from '../services/pos-tagger.service';

@Controller('pos')
export class PosController {

    constructor(
        private readonly posNameService: PosNameService,
        private readonly posTaggerService: PosTaggerService,
    ) {}

    @Get('names')
    public getPosNames(): PosName[] {
        return this.posNameService.getPosNames();
    }

    @Post('tag')
    public tagTextWithPos(): unknown {
        return this.posTaggerService.tagTextWithPos();
    }

    @Post('tag-inline')
    public tagTextWithPosInline(): string {
        return this.posTaggerService.tagTextWithPosInline();
    }

    @Post('tag-with-stems')
    public tagTextWithPosAndLemmatize(): unknown {
        return this.posTaggerService.tagTextWithPosAndLemmatize();
    }
}

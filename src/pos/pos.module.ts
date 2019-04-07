import { Module } from '@nestjs/common';
import { PosNameService } from './services/pos-name.service';
import { PosTaggerService } from './services/pos-tagger.service';
import { PosController } from './controllers/pos.controller';

@Module({
    providers: [PosNameService, PosTaggerService],
    controllers: [PosController],
})
export class PosModule {}

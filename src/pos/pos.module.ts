import { Module } from '@nestjs/common';
import { PosTaggerService } from './services/pos-tagger.service';
import { PosController } from './controllers/pos.controller';

@Module({
    providers: [PosTaggerService],
    controllers: [PosController],
})
export class PosModule {}

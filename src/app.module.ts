import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PosModule } from './pos/pos.module';

@Module({
    imports: [PosModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

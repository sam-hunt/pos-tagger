import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiUseTags, ApiProduces } from '@nestjs/swagger';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @Header('Content-Type', 'text/html')
    @ApiProduces('text/html')
    @ApiOkResponse({ description: 'OK' })
    @ApiOperation({ title: 'Display Application Information' })
    @ApiUseTags('app-info')
    getHello(): string {
        return this.appService.getHello();
    }
}

import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @Header('Content-Type', 'text/html')
    @ApiOkResponse({ description: 'OK' })
    getHello(): string {
        return this.appService.getHello();
    }
}

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const options = new DocumentBuilder()
        .setTitle('Part-of-speech Tagger Service')
        .setDescription(process.env.npm_package_description)
        .setVersion(process.env.npm_package_version)
        .addTag('app-info', 'Application Information')
        .addTag('pos-names', 'Part-of-Speech Naming')
        .addTag('pos-tagging', 'Part-of-Speech Tagging')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    await app.listen(3000);
}
bootstrap();

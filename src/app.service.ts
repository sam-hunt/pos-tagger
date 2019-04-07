import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return `
            <h1>Welcome to the Part-of-Speech Tagger Service</h1>
            <p>A microservice for tagging English text with part-of-speech tokens and lemmatisation.</p>
            <p>Check out the <a href="/docs">docs</a> for more information.</p><br/>
            <p>Powered by
                <a href="https://nestjs.com/">Nest</a>, and the
                <a href="https://nlp.stanford.edu/software/tagger.shtml">Stanford Log-linear Part-Of-Speech Tagger</a>.
            </p>
        `;
    }
}

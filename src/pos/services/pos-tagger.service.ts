import { Injectable, NotImplementedException } from '@nestjs/common';
import { exec } from 'child_process';
import { Readable } from 'stream';
import { writeFileSync, unlink, readFileSync } from 'fs';
import * as uuidv4 from 'uuid/v4';

@Injectable()
export class PosTaggerService {

    public async tagTextWithPos(text: string): Promise<unknown> {
        throw new NotImplementedException();
    }

    public async tagTextWithPosInline(text: string): Promise<string> {
        // TODO: Use stdin stream for input rather than filesystem
        const tmpFilename = `/tmp/${uuidv4()}.txt`;
        await writeFileSync(tmpFilename, text.trim());

        const command = `java -mx300m ` +
            `-cp 'stanford-postagger-2018-10-16/stanford-postagger.jar:' edu.stanford.nlp.tagger.maxent.MaxentTagger ` +
            `-model ./stanford-postagger-2018-10-16/models/english-left3words-distsim.tagger ` +
            `-textFile ${tmpFilename}`;
        const result = await this.streamToString(exec(command).stdout);
        await unlink(tmpFilename, () => null );
        return result.trim();
    }

    public async tagTextWithPosAndLemmatize(text: string): Promise<unknown> {
        throw new NotImplementedException();
    }

    private async streamToString(stream: Readable): Promise<string> {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => resolve(chunks.join()));
        });
    }
}

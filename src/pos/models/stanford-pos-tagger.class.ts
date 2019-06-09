import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Socket } from 'net';
import { spawn, ChildProcess, SpawnOptions } from 'child_process';

import { PosTagger } from './pos-tagger.class';
import { TaggedSentence } from './tagged-sentence.class';
import { TaggerJob } from './tagger-job.interface';
import { TaggedWord } from './tagged-word.class';

export class StanfordPosTagger extends PosTagger {
    private readonly logger = new Logger('StanfordPosTagger');

    private childProcess: ChildProcess;
    private socket: Socket;

    private currentJob: TaggerJob = null;
    private waitingJobs: TaggerJob[] = [];

    // TODO: Refactor this back to a service, to utilise OnModuleInit and OnModuleDestroy lifecycle hooks
    // TODO: handle OS signals with app.close() to gracefully shutdown modules
    constructor() {
        super();
        const command = `java`;
        const args: string[] = [
            `-mx300m`,
            `-cp`, `'stanford-postagger-2018-10-16/stanford-postagger.jar:'`, `edu.stanford.nlp.tagger.maxent.MaxentTaggerServer`,
            `-model`, `./stanford-postagger-2018-10-16/models/english-left3words-distsim.tagger`,
            `-port`, `8889`,
            `-outputFormat`, `xml`,
            `-outputFormatOptions`, `lemmatize`,
        ];
        this.logger.log(`Starting Child Process...`);
        this.logger.verbose(`${command} ${args.join(' ')}`);
        this.childProcess = spawn(command, args, { shell: true });

        this.childProcess.on('error', err => this.logger.error(err));
        this.childProcess.on('exit', err => {
            this.logger.error(err.toString().trim());
            this.logger.error('Child process shut down unexpectedly, unable to continue.');
            if (this.currentJob) { this.currentJob.reject(); }
            this.waitingJobs.forEach(job => job.reject());
            setImmediate(() => process.exit(0));
        });
    }

    private parseFullXmlResponse(response: string): TaggedSentence[] {
        // TODO: Use an xml parser :P
        const sentenceXmlFragments = response
            .split('<sentence')
            .map(fragment => fragment.replace('</sentence>', '').trim());
        // Remove the leading non-sentence fragment
        sentenceXmlFragments.shift();
        return sentenceXmlFragments.map(fragment => this.parseSentenceFromXmlFragment(fragment));
    }

    private parseSentenceFromXmlFragment(sentenceXmlFragment: string): TaggedSentence {
        const wordXmlFragments = sentenceXmlFragment
            .split('<word')
            .map(fragment => fragment.replace('</word>', '').trim());
        // Remove the leading non-word fragment
        wordXmlFragments.shift();

        const words: TaggedWord[] = wordXmlFragments.map(fragment => this.parseWordFromXmlFragment(fragment));
        return plainToClass(TaggedSentence, { words });
    }

    private parseWordFromXmlFragment(wordXmlFragment: string): TaggedWord {
        const word = wordXmlFragment.substr(wordXmlFragment.indexOf('>') + 1);
        const pos = /(?:pos=")([^"]*)(?:")/.exec(wordXmlFragment)[1];
        const lemma = /(?:lemma=")([^"]*)(?:")/.exec(wordXmlFragment)[1];
        return plainToClass(TaggedWord, { word, pos, lemma });
    }

    public async tag(sentences: string): Promise<TaggedSentence[]> {
        if (!sentences.trim()) {
            return [];
        }
        sentences = sentences.replace(/\r?\n/g, ' ');
        let resolve: (s: TaggedSentence[]) => void;
        let reject: () => void;
        const promise = new Promise<TaggedSentence[]>((promiseResolve, promiseReject) => {
            resolve = promiseResolve;
            reject = promiseReject;
        });
        const job: TaggerJob = { sentences, promise, xmlResponseBuffer: '', resolve, reject };
        this.waitingJobs.unshift(job);
        this.startNextJobIfReady();
        return await promise;
    }

    private startNextJobIfReady(): Promise<void> {
        if (this.currentJob !== null) {
            this.logger.log('Tagger is busy, waiting for current job to complete');
            return;
        }
        if (this.waitingJobs.length < 1) {
            this.logger.log('Tagger job queue is empty, waiting for new jobs');
            return;
        }
        this.logger.log('Starting next job');
        this.currentJob = this.waitingJobs.pop();
        this.socket  = new Socket().connect(8889, '127.0.0.1');
        this.socket.setEncoding('utf-8');
        this.socket.write(this.currentJob.sentences + '\n');
        this.socket.on('data', (data: string) => {
            this.logger.verbose(data);
            this.currentJob.xmlResponseBuffer += data.replace(/\r\n/g, '\n').trim();
        });
        this.socket.on('close', (hadError => {
            if (!hadError) {
                const taggedSentences = this.parseFullXmlResponse(this.currentJob.xmlResponseBuffer);
                this.currentJob.resolve(taggedSentences);
            } else {
                this.logger.error('An unknown socket error has occured. Rejecting job and continuing.');
                this.currentJob.reject();
            }
            this.currentJob = null;
            this.startNextJobIfReady();
        }));
    }
}

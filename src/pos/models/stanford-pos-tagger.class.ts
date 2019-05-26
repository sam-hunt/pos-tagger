import { Logger } from '@nestjs/common';
import * as pty from 'node-pty';

import { PosTagger } from './pos-tagger.class';
import { TaggedSentence } from './tagged-sentence.class';
import { TaggerJob } from './tagger-job.interface';
import { TaggedWord } from './tagged-word.class';
import { plainToClass } from 'class-transformer';

export class StanfordPosTagger extends PosTagger {
    private readonly logger = new Logger('StanfordPosTagger');

    // TODO: Use node native streams instead of IPty
    private childProcess: pty.IPty;
    private currentJob: TaggerJob = null;
    private waitingJobs: TaggerJob[] = [];
    private stdoutLinesReceived = 0;

    // TODO: Refactor this back to a service, to utilise OnModuleInit and OnModuleDestroy
    // TODO: handle OS signals with app.close() to gracefully shutdown modules
    constructor() {
        super();
        const command = `java`;
        const args: string[] = [
            `-mx300m`,
            `-cp`, `stanford-postagger-2018-10-16/stanford-postagger.jar:`, `edu.stanford.nlp.tagger.maxent.MaxentTagger`,
            `-model`, `./stanford-postagger-2018-10-16/models/english-left3words-distsim.tagger`,
            `-outputFormat`, `inlineXML`,
            `-outputFormatOptions`, `lemmatize`,
        ];
        this.childProcess = pty.spawn(command, args, {});

        this.childProcess.on('data', (stdoutData: string) => {
            stdoutData = stdoutData.replace(/\r\n/g, '\n');
            this.logger.verbose(stdoutData.trim());
            if (this.taggerIsStartingUp || !stdoutData || this.isEchoedStdinData(stdoutData)) {
                return;
            }
            if (this.taggerIsBusy) {
                this.parseAndAppendPartialResponse(stdoutData);
                if (this.isCurrentJobComplete) {
                    this.currentJob.resolve(this.currentJob.resultBuffer);
                    this.currentJob = null;
                    this.startNextJobIfReady();
                }
            }
        });

        this.childProcess.on('exit', (err) => {
            this.logger.error(err.toString().trim());
            this.currentJob.reject();
            this.waitingJobs.forEach(job => job.reject());
            this.logger.error('Child process shut down unexpectedly, unable to continue.');
            setImmediate(() => process.exit(0));
        });
        setImmediate(() => this.logger.log('Loaded the Stanford Pos Tagger'));
    }

    private isEchoedStdinData(data: string): boolean {
        const result = this.currentJob && (this.currentJob.sentences === data.trim());
        if (result) { this.logger.log(`Data received via stdout is echoed stdin input.`); }
        return result;
    }

    private parseAndAppendPartialResponse(partialResponse: string) {
        // TODO: Use regex matcher instead for clarity, passing xml tag stripping responsibility to child
        const sentenceXmlFragments = partialResponse
            .split('<sentence')
            .map(fragment => fragment.replace('</sentence>', '').trim());
        // If the fragment starts midsentence, append all tagged words to the last sentence
        if (sentenceXmlFragments[0].indexOf('<word') >= 0) {
            this.currentJob.resultBuffer[this.currentJob.resultBuffer.length - 1].words
                .push(...this.parseSentenceFromXmlFragment(sentenceXmlFragments[0]).words);
        }
        // Remove the leading non-sentence fragment
        sentenceXmlFragments.shift();

        const sentences: TaggedSentence[] = sentenceXmlFragments.map(fragment => this.parseSentenceFromXmlFragment(fragment));
        this.currentJob.resultBuffer.push(...sentences);
    }

    private parseSentenceFromXmlFragment(sentenceXmlFragment: string): TaggedSentence {
        // TODO: Support rare mid-word xml fragmentation cases.
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

    get isCurrentJobComplete(): boolean {
        let remaining = this.currentJob.sentences;
        for (const taggedSentence of this.currentJob.resultBuffer) {
            for (const taggedWord of taggedSentence.words) {
                remaining = remaining.substr(remaining.indexOf(taggedWord.word) + taggedWord.word.length);
            }
        }
        const result = remaining.trim().length === 0;
        this.logger.log(`Job ${result ? 'complete' : 'pending further output'}`);
        return result;
    }

    get taggerIsStartingUp(): boolean {
        return this.stdoutLinesReceived++ < 3;
    }

    get taggerIsBusy(): boolean {
        return this.currentJob !== null;
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
        this.waitingJobs.unshift({ sentences, promise, resultBuffer: [], resolve, reject });
        this.startNextJobIfReady();
        return await promise;
    }

    private startNextJobIfReady(): Promise<void> {
        if (this.taggerIsBusy) {
            this.logger.log('Tagger is busy, waiting for current job to complete');
            return;
        }
        if (this.waitingJobs.length < 1) {
            this.logger.log('Tagger job queue is empty, waiting for new jobs');
            return;
        }
        this.logger.log('Starting next job');
        this.currentJob = this.waitingJobs.pop();
        this.childProcess.write(this.currentJob.sentences + '\n');
    }
}

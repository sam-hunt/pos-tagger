import { TaggedSentence } from './tagged-sentence.class';

export interface TaggerJob {
    sentences: string;
    xmlResponseBuffer: string;
    promise: Promise<TaggedSentence[]>;
    resolve: (s: TaggedSentence[]) => void;
    reject: () => void;
}

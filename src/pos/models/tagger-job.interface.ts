import { TaggedSentence } from './tagged-sentence.class';

export interface TaggerJob {
    sentences: string;
    resultBuffer: TaggedSentence[];
    promise: Promise<TaggedSentence[]>;
    resolve: (s: TaggedSentence[]) => void;
    reject: () => void;
}

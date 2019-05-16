import { TaggedSentence } from './tagged-sentence.class';

export abstract class PosTagger {
    public abstract async tag(sentence: string): Promise<TaggedSentence[]>;
}

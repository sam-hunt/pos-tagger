import { TaggedWord } from './tagged-word.class';
import { ApiModelProperty } from '@nestjs/swagger';

export class TaggedSentence {
    @ApiModelProperty({ description: 'An array containing the tagged words in this sentence', type: TaggedWord, isArray: true })
    words: TaggedWord[];
}

import { ApiModelProperty } from '@nestjs/swagger';

export class TaggedWord {
    @ApiModelProperty({ description: 'The original word from the sentence', example: 'ate' })
    word: string;

    @ApiModelProperty({ description: 'The part of speech token of the word', example: 'VBD' })
    pos: string;

    @ApiModelProperty({ description: 'The lemmatised form of the original word', example: 'eat' })
    lemma: string;
}

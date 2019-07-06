import { ApiModelProperty } from '@nestjs/swagger';

export class Token {
    @ApiModelProperty()
    index: number;

    @ApiModelProperty()
    word: string;

    @ApiModelProperty()
    originalText: string;

    @ApiModelProperty()
    lemma: string;

    @ApiModelProperty()
    characterOffsetBegin: number;

    @ApiModelProperty()
    characterOffsetEnd: number;

    @ApiModelProperty()
    pos: string;

    @ApiModelProperty()
    ner: string;

    @ApiModelProperty()
    truecase: string;

    @ApiModelProperty()
    truecaseText: string;

    @ApiModelProperty()
    before: string;

    @ApiModelProperty()
    after: string;
}

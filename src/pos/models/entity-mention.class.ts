import { ApiModelProperty } from '@nestjs/swagger';

export class EntityMention {
    @ApiModelProperty()
    docTokenBegin: number;

    @ApiModelProperty()
    docTokenEnd: number;

    @ApiModelProperty()
    tokenBegin: number;

    @ApiModelProperty()
    tokenEnd: number;

    @ApiModelProperty()
    text: string;

    @ApiModelProperty()
    characterOffsetBegin: number;

    @ApiModelProperty()
    characterOffsetEnd: number;

    @ApiModelProperty()
    ner: string;
}
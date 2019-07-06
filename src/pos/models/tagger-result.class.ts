import { ApiModelProperty } from '@nestjs/swagger';
import { Sentence } from './sentence.class';

export class TaggerResult {
    @ApiModelProperty({ description: 'An array containing a list of parsed sentences', type: Sentence, isArray: true })
    sentences: Sentence[];
}

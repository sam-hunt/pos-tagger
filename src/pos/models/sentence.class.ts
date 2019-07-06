import { ApiModelProperty } from '@nestjs/swagger';
import { Dependency } from './dependency.class';
import { EntityMention } from './entity-mention.class';
import { Token } from './token.class';

export class Sentence {
    @ApiModelProperty()
    index: number;

    @ApiModelProperty({ type: Dependency, isArray: true })
    basicDependencies: Dependency[];

    // @ApiModelProperty({ type: Dependency, isArray: true })
    enhancedDependencies?: Dependency[];

    // @ApiModelProperty({ type: Dependency, isArray: true })
    enhancedPlusPlusDependencies?: Dependency[];

    @ApiModelProperty({ type: EntityMention, isArray: true })
    entitymentions: EntityMention[];

    @ApiModelProperty({ type: Token, isArray: true })
    tokens: Token[];
}

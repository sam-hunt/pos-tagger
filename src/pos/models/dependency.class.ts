import { ApiModelProperty } from '@nestjs/swagger';

export class Dependency {
    @ApiModelProperty()
    dep: string;

    @ApiModelProperty()
    governor: number;

    @ApiModelProperty()
    governorGloss: string;

    @ApiModelProperty()
    dependent: number;

    @ApiModelProperty()
    dependentGloss: string;
}
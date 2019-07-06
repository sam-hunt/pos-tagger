import { ApiModelProperty } from '@nestjs/swagger';

export class TokenDescription {
    @ApiModelProperty()
    readonly token: string;

    @ApiModelProperty()
    readonly description: string;
}

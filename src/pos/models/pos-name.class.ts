import { ApiModelProperty } from '@nestjs/swagger';

export class PosName {
    @ApiModelProperty()
    readonly token: string;

    @ApiModelProperty()
    readonly description: string;
}

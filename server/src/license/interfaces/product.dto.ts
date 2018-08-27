import { ApiModelProperty } from '@nestjs/swagger';

export class NewProductDto {
    @ApiModelProperty()
    name: string;
}
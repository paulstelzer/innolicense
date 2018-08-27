import { ApiModelProperty } from '@nestjs/swagger';
import { WpPlugin } from './wp-plugin.entity';

export class CreatePluginDto {
    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    slug: string;

    @ApiModelProperty()
    version: string;

    @ApiModelProperty()
    downloadUrl: string;

    @ApiModelProperty()
    description: string;

    @ApiModelProperty()
    homepage?: string;

    @ApiModelProperty()
    requires?: string;

    @ApiModelProperty()
    tested?: string;

    @ApiModelProperty()
    author?: string;

    @ApiModelProperty()
    authorHomepage?: string;

}

export class AddLicenseToPluginDto {
    @ApiModelProperty()
    licenseId: number;
}

export class UpdateWpPluginDto {

    @ApiModelProperty()
    data: WpPlugin;

    @ApiModelProperty()
    notify?: boolean;

    @ApiModelProperty()
    template?: string;
}



export class CreateEnvatoItemDto {
    @ApiModelProperty()
    id: number;

    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    type: string;

    @ApiModelProperty()
    licenseId: number;
}
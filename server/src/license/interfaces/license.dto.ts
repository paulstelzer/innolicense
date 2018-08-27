import { ApiModelProperty } from '@nestjs/swagger';

export class CreateNewLicensenumberDto {
  @ApiModelProperty()
  readonly buyer: string;

  @ApiModelProperty()
  readonly buyerEmail: string;

  @ApiModelProperty()
  readonly sendEmail: boolean;
}

export class CreateLicenseDto {
  @ApiModelProperty()
  readonly name: string;

  @ApiModelProperty()
  readonly validTime: number;

  @ApiModelProperty()
  readonly supportTime: number;

  @ApiModelProperty()
  readonly volume: number;

  @ApiModelProperty()
  readonly features: string[];
  
  
}

export class CheckLicenseNumberDto {
  @ApiModelProperty()
  readonly id: string;

  @ApiModelProperty()
  readonly action: string;

  @ApiModelProperty()
  readonly url: string;

  @ApiModelProperty()
  readonly feature: string;

  @ApiModelProperty()
  readonly envato?: boolean;

  @ApiModelProperty()
  readonly email?: string;
}
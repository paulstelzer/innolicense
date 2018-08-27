import { LicenseModel } from './license.model';

export class ClearLicenses {
    static type = '[License] Clear';
}

export class CheckLicenses {
    static type = '[License] Check';
}

export class AddLicense {
    static type = '[License] Add new';
    constructor(public productId: number, public data: LicenseModel) { }
}

export class UpdateLicense {
    static type = '[License] Update';
    constructor(public productId: number, public data: LicenseModel) { }
}

export class UpdateWpPluginLicense {
    static type = '[License] Update WordPress Plugin';
    constructor(public licenseId: number, public slug: string) { }
}

export class DeleteLicense {
    static type = '[License] Delete';
    constructor(public productId: number, public id: number) { }
}

export class RefreshLicenses {
    static type = '[License] Refresh all';
    constructor(public productId: number) { }
}

export class AddedLicense {
    static type = '[License] Added';
    constructor(public productId: number, public data: LicenseModel) { }
}

export class AddEnvatoItem {
    static type = '[License] Add Envato Item';
    constructor(public productId: number, public licenseId: number, public data: any) { }
}

export class EnvatoItemAdded {
    static type = '[License] Envato Item added';
    constructor(public res: any) { }
}

export class CreateLicensenumber {
    static type = '[License] Add Licensenumber';
    constructor(public productId: number, public licenseId: number, public email: string, public sendEmail: boolean) { }
}
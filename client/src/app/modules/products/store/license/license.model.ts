
export interface LicenseModel {
    id?: number;
    name: string;
    validTime: number;
    supportTime: number;
    volume: number;
    features: string[];
    product?: any;
    productId?: any;
    plugins?: any[];
    envato?: any[];
    licenseNumbers?: LicensenumberModel[];
}

export interface LicenseStateModel {
    [num: number]: LicenseModel[];
}

export interface LicensenumberModel {
    id: string;
    envatoId: string;
    status: string;
    activatedOn: Date;
    createdAt: Date;
    validUntil: Date;
    supportUntil: Date;
    userId: number;
    licenseId: number;
    notify: boolean;
    licenseName?: string;
    url: string[];
}
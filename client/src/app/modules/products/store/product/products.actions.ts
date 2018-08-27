export class ClearProducts {
    static type = '[Product] Clear';
}

export class CheckProducts {
    static type = '[Product] Check';
}

export class AddProduct {
    static type = '[Product] Add new';
    constructor(public name: string) { }
}

export class DeleteProduct {
    static type = '[Product] Delete';
    constructor(public id: number) { }
}

export class RefreshAllProducts {
    static type = '[Product] Refresh all';
}

export class AddedProduct {
    static type = '[Product] Added';
    constructor(public id: number, public name: string) { }
}
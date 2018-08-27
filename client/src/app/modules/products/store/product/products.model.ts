export interface ProductsStateModel {
    products: ProductModel[];
}

export interface ProductApiModel {
    _status: string;
    id?: number;
    secretKey?: string;
    errorMessage?: string;
}

export interface ProductModel {
    id: number;
    name: string;
    secretKey: string;
}
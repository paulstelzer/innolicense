import { Router } from '@angular/router';
import { Action, Selector, State, StateContext, NgxsOnInit, createSelector, Actions, ofActionSuccessful } from '@ngxs/store';
import { ProductsStateModel, ProductModel } from './products.model';
import { ApiService } from '../../services/api.service';
import { AddProduct, RefreshAllProducts, CheckProducts, AddedProduct, DeleteProduct, ClearProducts } from './products.actions';
import { UserNull } from '../../../user/store/user.actions';

@State<ProductsStateModel>({
    name: 'products',
    defaults: {
        products: []
    }
})
export class ProductsState implements NgxsOnInit {
    /**
     * Selectors
     */
    @Selector()
    static getProducts(state: ProductsStateModel) {
        return state.products;
    }

    static getProduct(id: number) {
        return createSelector([ProductsState], (state: ProductsStateModel) => {
            const product: ProductModel[] = state.products.filter(product => product.id === id);
            if (product && product.length > 0) return product[0];
            return null;
        });
    }

    constructor(
        private router: Router,
        private api: ApiService,
        private actions: Actions,
    ) {

    }

    /**
     * Init
     */
    ngxsOnInit(ctx: StateContext<ProductsStateModel>) {
        ctx.dispatch(new CheckProducts());

        this.actions.pipe(ofActionSuccessful(UserNull)).subscribe((data) => {
            ctx.dispatch(new ClearProducts());
        });
    }

    /**
     * Commands
     */
    @Action(CheckProducts)
    checkProducts(ctx: StateContext<ProductsStateModel>) {
        const current = ctx.getState()
        if (!current) {
            ctx.setState({
                products: []
            })
        }
    }

    @Action(AddProduct)
    async addProduct(ctx: StateContext<ProductsStateModel>, { name }: AddProduct) {
        const product = await this.api.addProduct(name);
        if (product && product.id) {
            ctx.dispatch(new AddedProduct(product.id, name))
            ctx.dispatch(new RefreshAllProducts());
        }
    }

    @Action(DeleteProduct)
    async deleteProduct(ctx: StateContext<ProductsStateModel>, { id }: DeleteProduct) {
        const currentProducts = ctx.getState().products;
        const newProducts = currentProducts.filter(product => product.id !== id);
        ctx.patchState({
            products: newProducts
        })
        const product = await this.api.deleteProduct(id);
        if (product) {
            // ctx.dispatch(new AddedProduct(product.id, name))
            // ctx.dispatch(new RefreshAllProducts());
        } else {
            ctx.patchState({
                products: currentProducts
            })
        }
    }

    @Action(AddedProduct)
    async addedProduct(ctx: StateContext<ProductsStateModel>, { id, name }: AddedProduct) { }

    @Action(RefreshAllProducts)
    async refreshProduct(ctx: StateContext<ProductsStateModel>) {
        const products = await this.api.getProducts();
        if (products) {
            ctx.patchState({
                products: products
            })
        }
    }

    @Action(ClearProducts)
    async clear(ctx: StateContext<ProductsStateModel>) {
        ctx.setState({
            products: []
        })
    }

}

import { Router, ActivatedRoute } from '@angular/router';
import { ProductModel } from '../../../../modules/products/store/product/products.model';
import { ProductsState } from '../../../../modules/products/store/product/products.state';
import { AddProduct, RefreshAllProducts, AddedProduct, DeleteProduct } from '../../../../modules/products/store/product/products.actions';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store, Select, Actions, ofActionSuccessful } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RefreshAllPlugins } from '../../../../modules/products/store/wp-plugin/wp-plugin.actions';

@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.scss']
})
export class ProductOverviewComponent implements OnInit {

  createProduct: boolean = false;

  productData = {
    name: ''
  }

  @Select(ProductsState.getProducts) products$: Observable<ProductModel[]>;

  constructor(
    private store: Store,
    private actions: Actions,
    private nav: NavController,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.store.dispatch(new RefreshAllProducts());
    this.store.dispatch(new RefreshAllPlugins());
    this.actions.pipe(ofActionSuccessful(AddedProduct)).subscribe((data) => {
      this.initProduct();
    });
  }

  initProduct() {
    this.createProduct = !this.createProduct;
    this.productData = {
      name: ''
    }
  }

  async addProduct(form: NgForm) {
    if (form.valid) {
      this.store.dispatch(new AddProduct(this.productData.name));
    }
  }

  openProduct(id) {
    this.nav.goForward('/product/' + id, true);
  }

  deleteProduct(id) {
    this.store.dispatch(new DeleteProduct(id));
  }

}

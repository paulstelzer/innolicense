import { PluginDetailComponent } from './../plugin-detail/plugin-detail.component';
import { WpPluginState } from './../../../../modules/products/store/wp-plugin/wp-plugin.state';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductModel } from '../../../../modules/products/store/product/products.model';
import { ProductsState } from '../../../../modules/products/store/product/products.state';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store, Select, Actions, ofActionSuccessful } from '@ngxs/store';
import { Observable } from 'rxjs';
import { WpPluginModel } from '../../../../modules/products/store/wp-plugin/wp-plugin.model';
import { RefreshAllPlugins, AddedPlugin, AddPlugin, DeletePlugin } from '../../../../modules/products/store/wp-plugin/wp-plugin.actions';

@Component({
  selector: 'app-plugin-overview',
  templateUrl: './plugin-overview.component.html',
  styleUrls: ['./plugin-overview.component.scss']
})
export class PluginOverviewComponent implements OnInit {
  createProduct: boolean = false;

  productData: WpPluginModel = {
    name: '',
    slug: '',
    version: '',
    downloadUrl: '',
    description: '',
    homepage: '',
    requires: '',
    tested: '',
    author: '',
    authorHomepage: '',
  }

  @Select(WpPluginState.getPlugins) products$: Observable<WpPluginModel[]>;

  constructor(
    private store: Store,
    private actions: Actions,
    private nav: NavController,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.store.dispatch(new RefreshAllPlugins());
    this.actions.pipe(ofActionSuccessful(AddedPlugin)).subscribe((data) => {
      this.initProduct();
    });
  }

  initProduct() {
    this.createProduct = !this.createProduct;
    this.productData = {
      name: '',
      slug: '',
      version: '',
      downloadUrl: '',
      description: '',
      homepage: '',
      requires: '',
      tested: '',
      author: '',
      authorHomepage: '',
    }
  }

  async addProduct(form: NgForm) {
    if (form.valid) {
      this.store.dispatch(new AddPlugin(this.productData));
    }
  }

  openProduct(id) {
    this.nav.navigateForward([`plugin/${id}`], true);
    //this.router.navigate([`plugin/${id}`]);
    
  }

  deleteProduct(id) {
    this.store.dispatch(new DeletePlugin(id));
  }
}

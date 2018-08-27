import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { ProductsState } from './store/product/products.state';
import { LicenseState } from './store/license/license.state';
import { WpPluginState } from './store/wp-plugin/wp-plugin.state';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    NgxsModule.forFeature([
      WpPluginState,
      ProductsState,
      LicenseState,

    ]),
  ],
  declarations: [],
})
export class ProductsModule { }

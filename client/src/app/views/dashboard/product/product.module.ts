
import { NgModule } from '@angular/core';

import { ProductRoutingModule } from './product.routing';
import { ProductOverviewComponent } from './product-overview/product-overview.component';
import { SharedModule } from '../../../shared/shared.module';
import { ProductsModule } from '../../../modules/products/products.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { LicenseDetailComponent } from './product-detail/license-detail/license-detail.component';


import { CdkTableModule } from '@angular/cdk/table';
import { LicensenumberTableComponent } from './product-detail/licensenumber-table/licensenumber-table.component';
import { MatSortModule } from '@angular/material';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    SharedModule,
    ProductsModule,
    ProductRoutingModule,
    CdkTableModule,
    MatSortModule,
    NgbPaginationModule
  ],
  declarations: [
    ProductOverviewComponent,
    ProductDetailComponent,
    LicenseDetailComponent,
    LicensenumberTableComponent,
  ],

})
export class ProductModule { }

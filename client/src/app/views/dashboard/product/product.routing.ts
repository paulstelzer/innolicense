import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductOverviewComponent } from './product-overview/product-overview.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { LicenseDetailComponent } from './product-detail/license-detail/license-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ProductOverviewComponent,
  },
  {
    path: ':id',
    component: ProductDetailComponent,
  },
  {
    path: ':id/license/:licenseid',
    component: LicenseDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }

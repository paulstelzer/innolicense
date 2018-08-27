import { ProductsModule } from './../../../modules/products/products.module';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';

import { PluginOverviewComponent } from './plugin-overview/plugin-overview.component';
import { WpPluginRoutingModule } from './wp-plugin.routing';
import { PluginDetailComponent } from './plugin-detail/plugin-detail.component';

import { QuillModule } from 'ngx-quill'

@NgModule({
  imports: [
    SharedModule,
    ProductsModule,
    WpPluginRoutingModule,
    QuillModule,
  ],
  declarations: [
    PluginOverviewComponent,
    PluginDetailComponent
  ]
})
export class WpPluginModule { }

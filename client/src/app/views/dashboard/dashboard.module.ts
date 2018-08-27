import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard.routing';
import { StartComponent } from './start/start.component';

@NgModule({
  imports: [
    SharedModule,
    DashboardRoutingModule
  ],
  declarations: [
    StartComponent,
  ]
})
export class DashboardModule { }

import { PluginOverviewComponent } from './plugin-overview/plugin-overview.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PluginDetailComponent } from './plugin-detail/plugin-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PluginOverviewComponent
  },
  {
    path: ':id',
    component: PluginDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WpPluginRoutingModule { }

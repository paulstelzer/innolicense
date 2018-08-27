import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullWidthComponent } from './shared/components/full-width/full-width.component';
import { LeftSidebarComponent } from './shared/components/left-sidebar/left-sidebar.component';
import { MiddleBoxComponent } from './shared/components/middle-box/middle-box.component';
import { LoggedInAuthGuard, NoAccountAuthGuard } from './modules/user/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [NoAccountAuthGuard],
    component: MiddleBoxComponent,
    loadChildren: './views/auth/auth.module#AuthModule'
  },
  {
    path: '',
    canActivate: [LoggedInAuthGuard],
    component: LeftSidebarComponent,
    loadChildren: './views/dashboard/dashboard.module#DashboardModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

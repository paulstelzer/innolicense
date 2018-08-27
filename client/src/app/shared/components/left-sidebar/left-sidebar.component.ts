import { UserState } from './../../../modules/user/store/user.state';
import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { UserSignOut } from '../../../modules/user/store/user.actions';
import { Observable } from 'rxjs';
import { UserModel } from '../../../modules/user/store/user.model';
import { platformEnvironment } from '../../../../environments/constants';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
  platformName: string = platformEnvironment.platform.name;
  
  loggedIn = false;
  isVendor = false;
  
  @Select(UserState.getUser) currentUser$: Observable<UserModel>;
  constructor(
    private menu: MenuController,
    private router: Router,
    private nav: NavController,
    private store: Store
  ) { }

  ngOnInit() {

    this.isVendor = this.store.selectSnapshot(UserState.isVendor);
  }

  
  async disable(menuId) {
    //this.menu.nativeElement.disabled = !this.menu.nativeElement.disabled;

    const enabled = await this.menu.isEnabled(menuId);

    this.menu.enable(!enabled, menuId)
  }

  async open(menuId) {
    this.menu.open(menuId)
  }

  async goTo(link) {
    //this.router.navigate([link]);
    this.nav.goForward(link);
  }

  signOut() {
    this.store.dispatch(new UserSignOut());
  }
}

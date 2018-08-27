import { UserState } from './../../../modules/user/store/user.state';
import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserModel } from '../../../modules/user/store/user.model';
import { platformEnvironment } from '../../../../environments/constants';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  platformName: string = platformEnvironment.platform.name;
  
  @Select(UserState.getUser) currentUser$: Observable<UserModel>;
  constructor() { }

  ngOnInit() {
  }

}

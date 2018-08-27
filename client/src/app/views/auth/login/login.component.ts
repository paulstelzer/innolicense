import { UserService } from '../../../modules/user/services/user.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store, Actions, ofActionDispatched, ofActionSuccessful } from '@ngxs/store';
import { SignInSuccess, UserSignIn, UserRegister } from '../../../modules/user/store/user.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userData = { email: '', password: '', vendor: false };

  constructor(
    private userService: UserService,
    private store: Store,
    private actions: Actions,
  ) {

  }

  ngOnInit() {
  }

  async login(form: NgForm) {
    if (form.valid) {
      this.store.dispatch(new UserSignIn(this.userData.email, this.userData.password));
    }
  }

}

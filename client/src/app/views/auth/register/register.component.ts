import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { NgForm } from '@angular/forms';
import { UserRegister } from '../../../modules/user/store/user.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userData = { email: '', password: '', vendor: false };

  constructor(
    private store: Store,
  ) { }

  ngOnInit() {
  }


  async signUp(form: NgForm) {
    if (form.valid) {
      this.store.dispatch(new UserRegister(this.userData.email, this.userData.password, this.userData.vendor));
    }
  }

}

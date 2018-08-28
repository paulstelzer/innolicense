import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { SharedModule } from '../../../shared/shared.module';
import { NgxsModule, Store } from '@ngxs/store';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { UserSignIn } from '../../../modules/user/store/user.actions';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: Store;

  beforeEach(async(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [NgxsModule.forRoot(), IonicModule.forRoot(), SharedModule, RouterTestingModule]
    })
      .compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should login', (done) => {
    store.dispatch(new UserSignIn('test@test.com', 'test1234')).subscribe(data => {
      const token = (data && data.user && data.user.token) ? data.user.token : null;
      expect(token).toEqual(jasmine.any(String));
      done();
    });
  });

});

import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { UserState } from '../store/user.state';
import { tap } from 'rxjs/operators';
import { UserNull, UserFailed } from '../store/user.actions';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    public store: Store,
    private router: Router,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    const token = this.store.selectSnapshot(UserState.getToken);
    // console.log('Get token', token)

    if (token) {
      const bearer = `Bearer ${token}`;

      request = request.clone({
        headers: new HttpHeaders().set('Authorization', bearer)
      });
    }

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // do stuff with response if you want
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 403 || err.status === 401) {
            if (err.error && err.error.error) {
              console.log('We have an error', err.error.error);
              if (err.error.error === 'Unauthorized') {
                this.store.dispatch(new UserFailed('Du hast keinen Zugriff mehr! Bitte logge dich erneut ein!'));
              } else {
                this.store.dispatch(new UserFailed('Ein Fehler ist aufgetreten! Bitte logge dich erneut ein!'));
              }

              setTimeout(() => {
                this.router.navigate(['login']);
              }, 1000);

            }

          }
        }
      })
    );
  }
}

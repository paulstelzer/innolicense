import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserState } from '../store/user.state';

@Injectable({
    providedIn: 'root'
})
export class LoggedInAuthGuard implements CanActivate {

    constructor(private router: Router, private store: Store) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = this.store.selectSnapshot(UserState.getToken);
        if (token) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}

@Injectable({
    providedIn: 'root'
})
export class NoAccountAuthGuard implements CanActivate {

    constructor(private router: Router, private store: Store) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = this.store.selectSnapshot(UserState.getToken);
        if (!token) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }
}

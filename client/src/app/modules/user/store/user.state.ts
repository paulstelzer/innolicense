import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext, NgxsOnInit } from '@ngxs/store';
import { UserStateModel } from './user.model';
import { UserService } from '../services/user.service';
import { UserSuccess, UserNull, UserFailed, UserSignOut, UserSignIn, SignInSuccess, UserRegister, RegisterSuccess } from './user.actions';


@State<UserStateModel>({
    name: 'user',
    defaults: {
        user: null,
        token: null
    }
})
export class UserState implements NgxsOnInit {
    /**
     * Selectors
     */
    @Selector()
    static getUser(state: UserStateModel) {
        return state.user;
    }

    @Selector()
    static isVendor(state: UserStateModel): boolean {
        const find = state.user.roles.find(ele => ele === 'vendor')
        if (find && find.length > 0) {
            return true;
        }
        return false;
    }

    @Selector()
    static getToken(state: UserStateModel) {
        return state.token;
    }

    constructor(
        private userService: UserService,
        private router: Router,
        private toast: ToastController,
    ) {

    }

    /**
     * Init
     */
    ngxsOnInit(ctx: StateContext<UserStateModel>) {
        //ctx.dispatch(new CheckUser());
    }

    /**
     * Commands
     */

    @Action(UserSignIn)
    async signIn(ctx: StateContext<UserStateModel>, { email, password }: UserSignIn) {
        const user = await this.userService.signIn(email, password);

        if (user && user.user && user.token) {
            ctx.dispatch(new UserSuccess(user.user));
            return ctx.dispatch(new SignInSuccess(user.token.token));
        }
        return null;
    }

    @Action(UserRegister)
    async register(ctx: StateContext<UserStateModel>, { email, password, vendor }: UserRegister) {
        const user = await this.userService.register(email, password, vendor);

        if (user) return ctx.dispatch(new RegisterSuccess(user));
        return null;
    }

    @Action(UserSignOut)
    async signOut(ctx: StateContext<UserStateModel>) {
        this.router.navigate(['/login']);
        return ctx.dispatch(new UserNull());
    }

    /**
     * Events
     */
    @Action(SignInSuccess)
    signInSuccess(ctx: StateContext<UserStateModel>, { token }: SignInSuccess) {
        this.router.navigate(['/']);
        return ctx.patchState({
            token
        });
    }

    @Action(UserSuccess)
    setUserStateOnSuccess(ctx: StateContext<UserStateModel>, { user }: UserSuccess) {
        ctx.patchState({
            user: user
        });
    }

    @Action(UserFailed)
    async userFailed(ctx: StateContext<UserStateModel>, { message }: UserFailed) {
        if(message) {
            const errorToast = await this.toast.create({
                message: message,
                cssClass: 'toast-error',
                position: 'top',
                showCloseButton: true,
                closeButtonText: 'Okay',
                duration: 3000
            });
            errorToast.present();
        }
        ctx.dispatch(new UserNull());
        
    }

    @Action(UserNull)
    async setUserStateNull(ctx: StateContext<UserStateModel>) {
        ctx.patchState({
            user: null,
            token: null
        });
    }
}

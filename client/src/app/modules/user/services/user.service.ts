import { UserModel } from '../store/user.model';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { platformEnvironment } from '../../../../environments/constants';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    apiUrl = platformEnvironment.api.url;

    constructor(
        private http: HttpClient,
        private toast: ToastController,
    ) { }

    async createConnection(type, path, body = null) {
        try {
            let data: any = null;
            if (type === 'post') {
                data = await this.http.post(this.apiUrl + path, body).toPromise();
            } else if (type === 'get') {
                data = await this.http.get(this.apiUrl + path).toPromise();
            }
            if (data) {
                if (!data.success) {
                    this.showError(data.errorCode);
                }
            }
            return data;
        } catch (err) {
            if (err) {
                if (err.errorcode) {
                    this.showError(err.errorCode);
                } else if (err.error && !err.error.success && err.error.errorCode) {
                    this.showError(err.error.errorCode)
                }
            }
        }

        return null;
    }

    async signIn(email, password): Promise<any> {
        const user = await this.createConnection(
            'post',
            'auth/login',
            {
                email,
                password
            }
        );

        console.log('Return value', user);
        if (user) {
            if (user.success) {
                return user.data;
            }
        }

        return null;
    }

    async register(email, password, vendor): Promise<UserModel> {
        const user = await this.createConnection(
            'post',
            'auth/register',
            {
                email,
                password,
                vendor
            }
        );

        if (user && user.success) {
            this.showSuccess('Dein Account wurde erfolgreich erstellt! Bitte verifiziere deine Email-Adresse');
            return user;
        }

        return null;
    }

    async showSuccess(successMessage) {
        const successToast = await this.toast.create({
          message: successMessage,
          cssClass: 'toast-success',
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'Okay',
          duration: 3000
        });
        successToast.present();
      }

    async showError(errorMessage) {
        console.log('Show error', errorMessage)
        let message = 'Ein Fehler ist aufgetreten!'
        switch (errorMessage) {
            case 'auth/failed':
                message = 'Deine Email-Adresse oder dein Passwort ist falsch!';
                break;
            case 'user/mail_exist':
                message = 'Die Email-Adresse wird bereits verwendet!';
                break;
            default:

                break;
        }
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
}
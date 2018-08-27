import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { environment } from '../../../../environments/environment';
import { ProductApiModel, ProductModel } from '../store/product/products.model';
import { WpPluginModel } from '../store/wp-plugin/wp-plugin.model';
import { platformEnvironment } from '../../../../environments/constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
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

  async addProduct(name): Promise<ProductModel> {
    const data = await this.createConnection(
      'post',
      'product/new',
      {
        name
      }
    );

    if (data && data.success) {
      const product: ProductModel = data.data;
      this.showSuccess('Produkt erfolgreich hinzugefügt');
      return product;
    }

    return null;
  }

  async deleteProduct(id): Promise<ProductModel> {
    const data = await this.createConnection(
      'get',
      `product/${id}/delete`
    );
    if (data && data.success) {
      const product: ProductModel = data.data;
      this.showSuccess('Produkt erfolgreich gelöscht');
      return product;
    }

    return null;
  }

  async getProducts() {
    const data = await this.createConnection('get', 'product/list');
    if (data && data.success) {
      const product: ProductModel[] = data.data;
      return product;
    }

    return null;
  }


  async getLicenses(productId) {
    const data = await this.createConnection('get', `product/${productId}/licenses`);
    if (data && data.success) {
      return data;
    }

    return null;
  }

  async addLicense(productId, data) {
    const license = await this.createConnection(
      'post',
      `product/${productId}/licenses/add`,
      {
        ...data
      }
    );
    if (license && license.success) {
      const licenseData: ProductModel = license.data;
      this.showSuccess('Lizenz erfolgreich hinzugefügt');
      return licenseData;
    }

    return null;
  }

  async updateLicense(productId, data) {
    const res = await this.createConnection(
      'post',
      `product/${productId}/licenses/${data.id}/update`,
      data
    );
    if (res && res.success) {
      this.showSuccess('Lizenz erfolgreich aktualisiert');
    }

    return res;
  }

  async deleteLicense(productId, id): Promise<any> {
    const res = await this.createConnection('get', `product/${productId}/licenses/${id}/delete`);
    if (res && res.success) {
      this.showSuccess('Lizenz erfolgreich gelöscht');
    }

    return res;
  }

  async getPlugins() {
    return await this.createConnection('get', 'wp-plugin/list');
  }

  async addPlugin(data): Promise<WpPluginModel> {
    const res = await this.createConnection(
      'post',
      `wp-plugin/new`,
      data
    );

    if (res && res.success) {
      this.showSuccess('Plugin erfolgreich hinzugefügt');
    }

    return res;
  }

  async updatePlugin(slug, data, notify): Promise<WpPluginModel> {
    const res = await this.createConnection(
      'post',
      `wp-plugin/${slug}/update`,
      {
        data,
        notify
      }
    );

    if (res && res.success) {
      this.showSuccess('Plugin erfolgreich aktualisiert');
    }

    return res;
  }

  async deletePlugin(slug) {
    const res = await this.createConnection('get', `wp-plugin/${slug}/delete`);
    if (res && res.success) {
      this.showSuccess('Plugin erfolgreich gelöscht');
    }

    return res;
  }

  async updateWpPluginLicense(licenseId, slug) {
    const res = await this.createConnection(
      'post',
      `wp-plugin/${slug}/license/add`,
      //`product/${productId}/licenses/${licenseId}/add-plugin`,
      {
        licenseId: licenseId
      }
    );

    if (res && res.success) {
      this.showSuccess('Plugin erfolgreich zur Lizenz hinzugefügt');
    }

    return res;
  }

  async addEnvatoItem(licenseId, data) {
    const res = await this.createConnection(
      'post',
      `license/${licenseId}/envato`,
      data
    );

    if (res && res.success) {
      this.showSuccess('Envato Item erfolgreich zur Lizenz hinzugefügt');
    }

    return res;
  }

  async createLicensenumber(licenseId, email, sendEmail: boolean) {
    const body = (email) ? { buyerEmail: email, sendEmail: sendEmail } : null;
    const res = await this.createConnection(
      'post',
      `license/${licenseId}/new`,
      body
    );

    if (res && res.success) {
      this.showSuccess('Lizenznummer erfolgreich erstellt');
    }

    return res;
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
    let message = 'Ein Fehler ist aufgetreten!'
    switch (errorMessage) {
      case 'data/params_missing': message = 'Es fehlen Parameter!'; break;

      case 'auth/failed': message = 'Deine Email-Adresse oder dein Passwort ist falsch!'; break;
      case 'auth/required': message = 'Du musst angemeldet sein!'; break;
      case 'user/mail_exist': message = 'Die E-Mail-Adresse wird bereits verwendet!'; break;
      case 'user/not_exist': message = 'Der Nutzer existiert nicht!'; break;

      case 'product/not_found': message = 'Das Produkt wurde nicht gefunden'; break;

      case 'license/wrong_id': message = 'Die Lizenz ID ist falsch'; break;
      case 'license/not_valid': message = 'Die Lizenz ist nicht gültig'; break;
      case 'license/not_found': message = 'Die Lizenz wurde nicht gefunden'; break;
      case 'license/support_date_ended': message = 'Der Supportzeitraum ist beendet'; break;
      case 'license/not_owner': message = 'Du verwaltest diese Lizenz nicht'; break;
      case 'license/not_available': message = 'Die Lizenz ist nicht verfügbar'; break;
      case 'license/no_feature': message = 'Die Funktion ist nicht Bestandteil der Lizenz'; break;
      case 'license/limit_reached': message = 'Du hast das Plugin auf der maximal zulässigen Anzahl an Websites installiert!'; break;

      case 'envato/license_invalid': message = 'Die Envato Lizenz ist nicht gültig!'; break;
      case 'envato/no_item': message = 'Es gibt kein Produkt für die ID bei Envato'; break;

      case 'plugin/not_found': message = 'Das Plugin wurde nicht gefunden'; break;
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

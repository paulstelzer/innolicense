import { ToastController } from '@ionic/angular';
import { WpPluginState } from './../../../../modules/products/store/wp-plugin/wp-plugin.state';
import { Component, OnInit } from '@angular/core';
import { Store, Actions } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { WpPluginModel } from '../../../../modules/products/store/wp-plugin/wp-plugin.model';
import { NgForm } from '@angular/forms';
import { UpdatePlugin } from '../../../../modules/products/store/wp-plugin/wp-plugin.actions';

@Component({
  selector: 'app-plugin-detail',
  templateUrl: './plugin-detail.component.html',
  styleUrls: ['./plugin-detail.component.scss']
})
export class PluginDetailComponent implements OnInit {
  productId: string = null;

  notify: boolean = true;

  productData: WpPluginModel = {
    name: '',
    slug: '',
    version: '',
    downloadUrl: '',
    description: '',
    changelog: '',
    homepage: '',
    requires: '',
    tested: '',
    author: '',
    authorHomepage: '',
  }

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    
      [{ 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],

      [{ 'header': [3, 4, 5, false] }],
    ],
  }


  constructor(
    private store: Store,
    private actions: Actions,
    private route: ActivatedRoute,
    private toast: ToastController
  ) { }

  ngOnInit() {
    this.productId = this.route.snapshot.params.id;
    this.store.select(WpPluginState.getPlugin(this.productId)).subscribe((data) => {
      if (data) {
        this.productData = data;
      }
    });
  }

  updateProduct(form: NgForm) {
    if (form.valid) {
      this.store.dispatch(new UpdatePlugin(this.productId, this.productData, this.notify));
    } else {
      this.showError('Bitte alle Pflichtfelder ausfüllen');
    }
  }

  async showError(message) {
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

import { LicenseState } from './../../../../../modules/products/store/license/license.state';
import { Component, OnInit, Input } from '@angular/core';
import { Store, Actions, Select, ofActionSuccessful } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { LicenseModel } from '../../../../../modules/products/store/license/license.model';
import { NgForm } from '@angular/forms';
import { RefreshAllPlugins } from '../../../../../modules/products/store/wp-plugin/wp-plugin.actions';
import { UpdateLicense, UpdateWpPluginLicense, AddEnvatoItem, EnvatoItemAdded, CreateLicensenumber } from '../../../../../modules/products/store/license/license.actions';
import { WpPluginState } from '../../../../../modules/products/store/wp-plugin/wp-plugin.state';
import { WpPluginModel } from '../../../../../modules/products/store/wp-plugin/wp-plugin.model';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-license-detail',
  templateUrl: './license-detail.component.html',
  styleUrls: ['./license-detail.component.scss']
})
export class LicenseDetailComponent implements OnInit {
  @Input() productId: number = null;
  @Input() licenseId: number = null;

  licenseData: LicenseModel = {
    name: '',
    validTime: 0,
    supportTime: 0,
    volume: 0,
    features: []
  }

  envato: any = {
    id: '',
    type: '',
    name: ''
  }

  userEmail = '';
  userSendEmail = false;

  features: string = '';

  editLicense = false;
  editPlugin = false;
  editEnvato = false;
  editLicensenumber = false;

  myPlugins = [];

  @Select(WpPluginState.getPlugins) plugins$: Observable<WpPluginModel[]>;

  constructor(
    private store: Store,
    private actions: Actions,
    //private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    //this.productId = +this.route.snapshot.params.id;
    // this.licenseId = +this.route.snapshot.params.licenseid;

    this.actions.pipe(ofActionSuccessful(EnvatoItemAdded)).subscribe((data) => {
      this.envato = {
        id: '',
        type: '',
        name: ''
      }
    });

    this.store.select(LicenseState.getLicense(this.productId, this.licenseId)).pipe(
      switchMap((data: any) => {
        if (data) {
          if (!this.editLicense) {
            this.licenseData = data;

            /*
            if (this.licenseData.licenseNumbers && this.licenseData.licenseNumbers.length > 0) {
              this.licenseData.licenseNumbers.sort((a, b) => {
                const aDate =new Date(a.createdAt);
                const bDate = new Date(b.createdAt);
                return aDate.getTime() - bDate.getTime()
              });
            }*/
            this.features = this.licenseData.features.join(',');
          }
        }

        return this.plugins$;
      })
    ).subscribe((data) => {
      this.myPlugins = [];
      if (data.length > 0) {
        for (let p of data) {
          this.myPlugins.push({
            name: p.name,
            slug: p.slug,
            active: (this.licenseData.plugins.find(element => element.slug === p.slug)) ? true : false
          });
        }
      }
    })
  }

  updateLicense(form: NgForm) {
    if (form.valid) {
      if (this.features) {
        this.licenseData.features = this.features.split(',');
      }
      this.store.dispatch(new UpdateLicense(this.productId, this.licenseData));
    }
  }

  setPlugin($event, slug) {
    this.store.dispatch(new UpdateWpPluginLicense(this.licenseId, slug))
  }

  addEnvatoItem(form) {
    if (form.valid) {
      this.store.dispatch(new AddEnvatoItem(this.productId, this.licenseId, this.envato));
    }
  }

  addLicensenumber() {
    this.store.dispatch(new CreateLicensenumber(this.productId, this.licenseId, this.userEmail, this.userSendEmail));
    this.userEmail = '';
  }

  copy(id) {
    window.addEventListener('copy', (e: ClipboardEvent) => {
      console.log('Copied');
      e.clipboardData.setData('text/plain', id);
      e.preventDefault();
    });

    const bool = document.execCommand('copy');
    console.log('bool', bool);


  }

}

import { NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { ProductsState } from '../../../../modules/products/store/product/products.state';
import { Component, OnInit } from '@angular/core';
import { Store, Select, Actions, ofActionSuccessful } from '@ngxs/store';
import { ProductModel } from '../../../../modules/products/store/product/products.model';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { LicenseModel } from '../../../../modules/products/store/license/license.model';
import { AddLicense, DeleteLicense, AddedLicense, RefreshLicenses } from '../../../../modules/products/store/license/license.actions';
import { LicenseState } from '../../../../modules/products/store/license/license.state';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productId = null;
  createLicense: boolean = false;

  product: ProductModel = {
    id: -1,
    name: '',
    secretKey: ''
  };

  licenseData: LicenseModel = {
    name: '',
    validTime: 0,
    supportTime: 0,
    volume: 0,
    features: []
  }

  licenses: LicenseModel[] = [];
  features = '';


  constructor(
    private store: Store,
    private router: Router,
    private actions: Actions,
    private route: ActivatedRoute,
    private nav: NavController
  ) { }

  ngOnInit() {
    this.productId = +this.route.snapshot.params.id;
    this.store.select(ProductsState.getProduct(this.productId)).subscribe((data) => {
      if (data) {
        this.product = data;
      }
    });

    this.store.select(LicenseState.getLicenses(this.productId)).subscribe((data) => {
      if (data) {
        this.licenses = data;
      }
    });

    this.store.dispatch(new RefreshLicenses(this.productId));
    this.actions.pipe(ofActionSuccessful(AddedLicense)).subscribe((data) => {
      this.initLicense(false);
    });
  }

  initLicense(bool = null) {
    if(bool) {
      this.createLicense = bool;
    } else {
      this.createLicense = !this.createLicense;
    }
    
    this.licenseData = {
      name: '',
      validTime: null,
      supportTime: null,
      volume: null,
      features: []
    }
  }

  addLicense(form: NgForm) {
    if (form.valid) {
      if(this.features) {
        this.licenseData.features = this.features.split(',');
      }
      this.store.dispatch(new AddLicense(this.productId, this.licenseData));
    }
  }

  deleteLicense(id) {
    this.store.dispatch(new DeleteLicense(this.productId, id));
  }

  openLicense(id) {
    this.nav.navigateForward([`product/${this.productId}/license/${id}`]);
    //this.router.navigate([`product/${this.productId}/license/${id}`]);
  }

}

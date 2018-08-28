import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailComponent } from './product-detail.component';
import { SharedModule } from '../../../../shared/shared.module';
import { LicenseDetailComponent } from './license-detail/license-detail.component';
import { LicensenumberTableComponent } from './licensenumber-table/licensenumber-table.component';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule } from '@angular/material';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { IonicModule } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductsState } from '../../../../modules/products/store/product/products.state';
import { LicenseState } from '../../../../modules/products/store/license/license.state';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDetailComponent, LicenseDetailComponent, LicensenumberTableComponent],
      imports: [BrowserAnimationsModule, IonicModule.forRoot(), NgxsModule.forRoot([ProductsState, LicenseState]), RouterTestingModule, SharedModule, CdkTableModule, MatSortModule, NgbPaginationModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

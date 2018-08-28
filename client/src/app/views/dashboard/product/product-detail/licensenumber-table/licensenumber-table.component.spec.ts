import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensenumberTableComponent } from './licensenumber-table.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSortModule } from '@angular/material';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxsModule } from '@ngxs/store';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { LicenseState } from '../../../../../modules/products/store/license/license.state';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LicensenumberTableComponent', () => {
  let component: LicensenumberTableComponent;
  let fixture: ComponentFixture<LicensenumberTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LicensenumberTableComponent],
      imports: [BrowserAnimationsModule, NgxsModule.forRoot([LicenseState]), IonicModule.forRoot(), SharedModule, CdkTableModule, MatSortModule, NgbPaginationModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensenumberTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

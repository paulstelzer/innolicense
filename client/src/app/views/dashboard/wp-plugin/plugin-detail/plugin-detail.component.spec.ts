import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginDetailComponent } from './plugin-detail.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ProductsModule } from '../../../../modules/products/products.module';
import { QuillModule } from 'ngx-quill';
import { NgxsModule } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

describe('PluginDetailComponent', () => {
  let component: PluginDetailComponent;
  let fixture: ComponentFixture<PluginDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PluginDetailComponent],
      imports: [NgxsModule.forRoot(), IonicModule.forRoot(), SharedModule, ProductsModule, QuillModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

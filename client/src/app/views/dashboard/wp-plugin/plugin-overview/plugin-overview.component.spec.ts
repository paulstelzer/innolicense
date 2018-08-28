import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginOverviewComponent } from './plugin-overview.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ProductsModule } from '../../../../modules/products/products.module';
import { NgxsModule } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { WpPluginState } from '../../../../modules/products/store/wp-plugin/wp-plugin.state';

describe('PluginOverviewComponent', () => {
  let component: PluginOverviewComponent;
  let fixture: ComponentFixture<PluginOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PluginOverviewComponent],
      imports: [NgxsModule.forRoot([WpPluginState]), IonicModule.forRoot(), SharedModule, ProductsModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

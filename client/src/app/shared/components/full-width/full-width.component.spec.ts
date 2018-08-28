import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullWidthComponent } from './full-width.component';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('FullWidthComponent', () => {
  let component: FullWidthComponent;
  let fixture: ComponentFixture<FullWidthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FullWidthComponent],
      imports: [IonicModule.forRoot(), IonicModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullWidthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

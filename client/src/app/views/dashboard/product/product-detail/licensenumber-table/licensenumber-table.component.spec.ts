import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensenumberTableComponent } from './licensenumber-table.component';

describe('LicensenumberTableComponent', () => {
  let component: LicensenumberTableComponent;
  let fixture: ComponentFixture<LicensenumberTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensenumberTableComponent ]
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

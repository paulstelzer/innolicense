import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiddleBoxComponent } from './middle-box.component';

describe('MiddleBoxComponent', () => {
  let component: MiddleBoxComponent;
  let fixture: ComponentFixture<MiddleBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiddleBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiddleBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

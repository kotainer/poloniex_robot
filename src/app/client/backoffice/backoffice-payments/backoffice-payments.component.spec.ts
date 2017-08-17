import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficePaymentsComponent } from './backoffice-payments.component';

describe('BackofficePaymentsComponent', () => {
  let component: BackofficePaymentsComponent;
  let fixture: ComponentFixture<BackofficePaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficePaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

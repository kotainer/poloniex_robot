import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeOrdersComponent } from './backoffice-orders.component';

describe('BackofficeOrdersComponent', () => {
  let component: BackofficeOrdersComponent;
  let fixture: ComponentFixture<BackofficeOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

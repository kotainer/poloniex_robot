import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficePromotionsListComponent } from './backoffice-promotions-list.component';

describe('BackofficePromotionsListComponent', () => {
  let component: BackofficePromotionsListComponent;
  let fixture: ComponentFixture<BackofficePromotionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficePromotionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficePromotionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

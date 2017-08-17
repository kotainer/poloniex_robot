import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeBalanceComponent } from './backoffice-balance.component';

describe('BackofficeBalanceComponent', () => {
  let component: BackofficeBalanceComponent;
  let fixture: ComponentFixture<BackofficeBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

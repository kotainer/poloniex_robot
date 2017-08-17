import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeAccrualsHistoryComponent } from './backoffice-accruals-history.component';

describe('BackofficeAccrualsHistoryComponent', () => {
  let component: BackofficeAccrualsHistoryComponent;
  let fixture: ComponentFixture<BackofficeAccrualsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeAccrualsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeAccrualsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

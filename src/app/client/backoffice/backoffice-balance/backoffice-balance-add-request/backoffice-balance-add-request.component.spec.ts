import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeBalanceAddRequestComponent } from './backoffice-balance-add-request.component';

describe('BackofficeBalanceAddRequsetComponent', () => {
  let component: BackofficeBalanceAddRequestComponent;
  let fixture: ComponentFixture<BackofficeBalanceAddRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BackofficeBalanceAddRequestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeBalanceAddRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

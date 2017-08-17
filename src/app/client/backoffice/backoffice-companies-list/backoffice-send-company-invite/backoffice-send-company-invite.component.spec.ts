import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeSendCompanyInviteComponent } from './backoffice-send-company-invite.component';

describe('BackofficeSendCompanyInviteComponent', () => {
  let component: BackofficeSendCompanyInviteComponent;
  let fixture: ComponentFixture<BackofficeSendCompanyInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeSendCompanyInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeSendCompanyInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

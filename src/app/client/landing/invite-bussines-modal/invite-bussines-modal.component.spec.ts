import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteBussinesModalComponent } from './invite-bussines-modal.component';

describe('InviteBussinesModalComponent', () => {
  let component: InviteBussinesModalComponent;
  let fixture: ComponentFixture<InviteBussinesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteBussinesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteBussinesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

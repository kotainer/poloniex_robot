import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeProfileComponent } from './backoffice-profile.component';

describe('BackofficeProfileComponent', () => {
  let component: BackofficeProfileComponent;
  let fixture: ComponentFixture<BackofficeProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

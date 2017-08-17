import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeRequestOnOutComponent } from './backoffice-request-on-out.component';

describe('BackofficeRequestOnOutComponent', () => {
  let component: BackofficeRequestOnOutComponent;
  let fixture: ComponentFixture<BackofficeRequestOnOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeRequestOnOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeRequestOnOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

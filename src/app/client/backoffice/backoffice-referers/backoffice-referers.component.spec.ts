import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeReferersComponent } from './backoffice-referers.component';

describe('BackofficeReferersComponent', () => {
  let component: BackofficeReferersComponent;
  let fixture: ComponentFixture<BackofficeReferersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeReferersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeReferersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

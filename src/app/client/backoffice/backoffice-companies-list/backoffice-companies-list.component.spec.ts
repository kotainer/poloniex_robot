import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeCompaniesListComponent } from './backoffice-companies-list.component';

describe('BackofficeCompaniesListComponent', () => {
  let component: BackofficeCompaniesListComponent;
  let fixture: ComponentFixture<BackofficeCompaniesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeCompaniesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeCompaniesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

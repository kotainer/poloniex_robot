import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewRateComponent } from './add-new-rate.component';

describe('AddNewRateComponent', () => {
  let component: AddNewRateComponent;
  let fixture: ComponentFixture<AddNewRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

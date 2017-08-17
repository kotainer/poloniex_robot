import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRateComponent } from './update-rate.component';

describe('UpdateRateComponent', () => {
  let component: UpdateRateComponent;
  let fixture: ComponentFixture<UpdateRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

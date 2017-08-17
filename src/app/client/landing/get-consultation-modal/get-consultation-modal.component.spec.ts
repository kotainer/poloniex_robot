import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetConsultationModalComponent } from './get-consultation-modal.component';

describe('GetConsultationModalComponent', () => {
  let component: GetConsultationModalComponent;
  let fixture: ComponentFixture<GetConsultationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetConsultationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetConsultationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

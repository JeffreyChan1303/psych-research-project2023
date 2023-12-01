import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { PatientRangeComponent } from './patient-range.component';

describe('PatientRangeComponent', () => {
  let component: PatientRangeComponent;
  let fixture: ComponentFixture<PatientRangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientRangeComponent],
      imports: [ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(PatientRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientInterpretationComponent } from './patient-interpretation.component';
import { PatientMaleFemaleComponent } from './patient-male-female/patient-male-female/patient-male-female.component';
import { PatientRangeComponent } from './patient-range/patient-range/patient-range.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('PatientInterpretationComponent', () => {
  let component: PatientInterpretationComponent;
  let fixture: ComponentFixture<PatientInterpretationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientInterpretationComponent, PatientMaleFemaleComponent, PatientRangeComponent],
      imports: [ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(PatientInterpretationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientInterpretationComponent } from './patient-interpretation.component';

describe('PatientInterpretationComponent', () => {
  let component: PatientInterpretationComponent;
  let fixture: ComponentFixture<PatientInterpretationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientInterpretationComponent]
    });
    fixture = TestBed.createComponent(PatientInterpretationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

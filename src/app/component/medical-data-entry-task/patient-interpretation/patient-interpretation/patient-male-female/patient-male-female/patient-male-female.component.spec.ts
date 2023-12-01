import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { PatientMaleFemaleComponent } from './patient-male-female.component';

describe('PatientMaleFemaleComponent', () => {
  let component: PatientMaleFemaleComponent;
  let fixture: ComponentFixture<PatientMaleFemaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientMaleFemaleComponent],
      imports: [ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(PatientMaleFemaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

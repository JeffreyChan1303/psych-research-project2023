import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { PatientSessionComponent } from './patient-session.component';

describe('PatientSessionComponent', () => {
  let component: PatientSessionComponent;
  let fixture: ComponentFixture<PatientSessionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientSessionComponent],
      imports: [ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(PatientSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

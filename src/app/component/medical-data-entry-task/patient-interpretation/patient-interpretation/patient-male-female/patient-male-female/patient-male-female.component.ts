import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-male-female',
  templateUrl: './patient-male-female.component.html',
  styleUrls: ['./patient-male-female.component.css']
})
export class PatientMaleFemaleComponent implements OnChanges {
  @Input() data: any;
  @Input() randomNumber!: number;

  patientForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.initForm();
      this.assignFormValue();
      console.log(this.randomNumber, "range")
    }
  }

  initForm() { 
    this.patientForm = this.fb.group({
      femaleName: ['', Validators.required],
      maleName: ['', Validators.required],
    });
  }

  assignFormValue() {
    // Assuming 'data' is an object with 'femaleRange' and 'maleRange' properties
    if (this.data) {
      const firstPatient = this.data[this.randomNumber];
      this.patientForm.patchValue({
        femaleName: firstPatient.femaleRange,
        maleName: firstPatient.maleRange
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-session',
  templateUrl: './patient-session.component.html',
  styleUrls: ['./patient-session.component.css'],
})
export class PatientSessionComponent implements OnInit {
  participantForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.participantForm = this.formBuilder.group({
      participantNumber: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  startSession() {
    if (this.participantForm.valid) {
      // You can access the entered participant number using this.participantForm.value.participantNumber
      this.router.navigate(['/data-entry-task']);
    } else {
      alert("Please double check the participant number and try again. it should be three digit between 100 to 400")
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  passwordForm!: FormGroup;
  adminForm!: FormGroup;
  isPasswordValid: boolean = false;
  isParticipantValid: boolean = false;

  constructor(private formBuilder: FormBuilder, private dataService: DataService) {}

  ngOnInit(): void {
    this.initForms();
  }
  initForms() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/^researcher2023$/)]]
    });

    this.adminForm = this.formBuilder.group({
      taskDurationSeconds: ['', Validators.required],
      breakDurationSeconds: ['', Validators.required],
      breakCountInterval: ['', Validators.required],
      breakTimeIntervalSeconds: ['', Validators.required],
      breakIntervalType: ['', Validators.required],
      participantNumber: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });

    // this will disable the update button when participant number changes
    this.adminForm.get('participantNumber')?.valueChanges.subscribe((participantNumber) => {
      // get the participant number, if we get a valid settings response, update the form values
      // with the data, and set the isParticipantValid to true
      this.isParticipantValid = false;
    });
  }

  checkPassword() {
    // switch ui to show the admin panel settings
    this.isPasswordValid = this.passwordForm.valid;

    if (!this.isPasswordValid) {
      alert('Incorrect Password!');
    }
  }

  downloadDataFromDatabase() {}
  fetchParticipantSettings() {
    // update if the participant is valid to allow the admin to update the participant's settings!!
    this.isParticipantValid = true;
  }
  updateParticipantSettings() {
    // Implement logic for what to do when the settings trigger button is clicked
    console.log('Settings Triggered!', this.adminForm);

    // check if inputs have been changed
    if (
      this.adminForm.get('taskDurationSeconds')?.dirty ||
      this.adminForm.get('breakDurationSeconds')?.dirty ||
      this.adminForm.get('breakCountInterval')?.dirty ||
      this.adminForm.get('breakTimeIntervalSeconds')?.dirty ||
      this.adminForm.get('breakIntervalType')?.dirty ||
      this.adminForm.get('participantNumber')?.dirty
    ) {
      // check the api error code to see if the participant number entered is valid or not

      // update participant settings in the server
      this.dataService
        .updateParticipantSettings({
          participant_number: this.adminForm.value.participantNumber,
          task_duration_seconds: this.adminForm.value.taskDurationSeconds,
          break_duration_seconds: this.adminForm.value.breakDurationSeconds,
          break_count_interval: this.adminForm.value.breakCountInterval,
          break_time_interval_seconds: this.adminForm.value.breakTimeIntervalSeconds,
          break_interval_type: this.adminForm.value.breakIntervalType
        })
        .subscribe((updatedParticipant) => {
          console.log('Update Participant Data: ', updatedParticipant);
          alert('Participant settings updated successfully!');
        });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';
import * as Papa from 'papaparse';
import { saveAs } from 'file-saver';

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

  downloadDataFromDatabase() {
    const participantNumber = this.adminForm.value.participantNumber;
    if (!participantNumber) {
      alert('Participant Number not found!! Unable to download data!!');
      return;
    }
    this.dataService.getSubmissionsAndBreaksByParticipantNumber(participantNumber.toString()).subscribe((data) => {
      console.log('get Submissions and break data from server: ', data);

      // Create CSV data
      const csvData: any[] = [];
      csvData.push(['', '']); // Empty row for separation
      csvData.push(['', 'Submissions By Participant Number']);
      csvData.push([
        'id',
        'session_id',
        'created_at',
        'given_interpretation',
        'entered_interpretation',
        'given_patient_id',
        'entered_patient_id',
        'is_valid',
        'last_interaction'
      ]); // Header

      // add submission data

      const submissionData = data[0];
      submissionData.forEach((s: any) => {
        let createdAt = new Date(s.created_at);
        createdAt.setHours(createdAt.getHours() + 2);
        csvData.push([
          s.id,
          s.session_id,
          createdAt.toString(),
          s.given_interpretation,
          s.entered_interpretation,
          s.given_patient_id,
          s.entered_patient_id,
          s.is_valid,
          s.last_interaction
        ]);
      });
      csvData.push(['', '']); // Empty row for separation
      csvData.push(['', 'Breaks By Participant Number']); // Empty row for separation
      csvData.push(['id', 'session_id', 'created_at', 'has_accepted', 'duration']); // Break Headers
      const breakData = data[1];
      breakData.forEach((item: any) => {
        let createdAt = new Date(item.created_at);
        createdAt.setHours(createdAt.getHours() + 2);
        csvData.push([item.id, item.session_id, createdAt.toString(), item.has_accepted, item.break_duration_seconds]);
      });

      // Convert CSV data to a string
      const csvString = Papa.unparse(csvData, { header: false });

      // Convert the string to a Blob
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });

      // Save the Blob as a CSV file
      saveAs(blob, 'patient_records_from_database.csv');
    });
  }
  fetchParticipantSettings() {
    // check if the participant number is valid
    if (this.adminForm.get('participantNumber')?.invalid) {
      alert(
        'Please double check the participant number and try again. it should be three digit between 100 to 999 inclusive.'
      );
      return;
    }
    this.dataService
      .getParticipantByParticipantNumber(this.adminForm.value.participantNumber)
      .subscribe((participant) => {
        if (participant) {
          console.log('Participant Data: ', participant);
          // update the form values with the participant data
          this.adminForm.patchValue({
            taskDurationSeconds: participant[0].task_duration_seconds,
            breakDurationSeconds: participant[0].break_duration_seconds,
            breakCountInterval: participant[0].break_count_interval,
            breakTimeIntervalSeconds: participant[0].break_time_interval_seconds,
            breakIntervalType: participant[0].break_interval_type
          });
          // update if the participant is valid to allow the admin to update the participant's settings!!
          this.isParticipantValid = true;
        } else {
          alert('getParticipantByParticipantNumber had an error!');
        }
      });

    // if there is a error, throw an error!!
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

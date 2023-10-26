// patient-range.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-patient-range',
  templateUrl: './patient-range.component.html',
  styleUrls: ['./patient-range.component.css']
})
export class PatientRangeComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<void>();
  @Input() data: any;
  @Input() randomNumber!: number;
  patientForm!: FormGroup;
  isShowProgressClicked = false;
  totalRecord = 0;
  correctRecord = 0;
  timeRemaining: number = 45 * 60; // 45 minutes in seconds
  timerInterval: any; // Variable to store the interval
  breakRemaining: number = 0;
  allRecords: any[] = [];
  isShowTimer = false;
  password = "researcher2023";
  isSubmitButtonActive = false;


  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.patientForm = this.fb.group({
      patientId: [''],
      interpretation: [],
      taskDuration: [45], // Default task duration in minutes
      breakCount: [10],   // Default break count after 10 records
      breakDuration: [10]  // Default break duration in seconds
    });
  }

  onSubmit() {
    this.formSubmitted.emit();
    this.checkIsDataInRange();

    // Check if the timer is already running
    if (!this.timerInterval) {
      this.startTimer();
    }
  }

  showProgress() {
    // if((this.isShowProgressClicked === false) && this.isPasswordCorrect()) {
      this.isShowProgressClicked = !this.isShowProgressClicked;
    // } else if (this.isShowProgressClicked === true) {
      // this.isShowProgressClicked = !this.isShowProgressClicked;
    // }
  }

  checkIsDataInRange() {
    let currentData = this.data[this.randomNumber];
    let maleOrFemaleRange = currentData.sex === 'Male' ? currentData.maleRange : currentData.femaleRange;
    let minValue = maleOrFemaleRange.split('to')[0];
    let maxValue = maleOrFemaleRange.split('to')[1];

    let isInCorrectRange = (currentData.hr > minValue && currentData.hr < maxValue) ? "withinRange" : "outOfRange";
    if (currentData.patientId === this.patientForm.value.patientId &&
        isInCorrectRange === this.patientForm.value.interpretation) {
      this.correctRecord += 1;
      this.totalRecord += 1;
    } else {
      this.totalRecord += 1;
    }

    const record = {
      currentPatientDetails: this.data[this.randomNumber],
      enteredPatientId: this.patientForm.value.patientId,
      enteredInterpretation: this.patientForm.value.interpretation,
      enteredResult: isInCorrectRange,
      timestamp: new Date()
    };

    this.allRecords.push(record);

    // Introduce breaks based on conditions
    if (this.totalRecord % this.patientForm.value.breakCount === 0) {
      this.showBreakPopup();
    }

    this.patientForm.patchValue({
      patientId: '',
      interpretation: ''
    });
  }

  startTimer() {
    // Check if there is remaining break time
    if (this.breakRemaining > 0) {
      // If there is, decrease breakRemaining
      this.breakRemaining--;
      this.isSubmitButtonActive = false;
    } else {
      // Otherwise, continue with the task duration timer
      const taskDurationInSeconds = this.timeRemaining > 0 ? this.timeRemaining : this.patientForm.value.taskDuration * 60;
  
      // Store the start time to consider the existing countdown time
      const startTime = Date.now() - (this.patientForm.value.taskDuration * 60 - this.timeRemaining) * 1000;
  
      // Store the interval ID
      this.timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000);
  
        if (this.breakRemaining > 0) {
          // If a break is needed, set breakRemaining to the break duration
          this.breakRemaining--;
        } else if (this.timeRemaining > 0) {
          // Continue counting down the task duration
          this.timeRemaining = taskDurationInSeconds - elapsedTimeInSeconds;
        } else {
          clearInterval(this.timerInterval);
          
          // If a break is needed, set breakRemaining to the break duration
          this.breakRemaining = this.patientForm.value.breakDuration;
          this.startTimer(); // Start the new timer (for the break)
        }
      }, 1000); // Update every second
    }
  }
  
  
  
  

  showBreakPopup() {
    const breakDurationInSeconds = this.patientForm.value.breakDuration;

    // Display the popup
    const userAcceptsBreak = confirm('Take a break?');
    if (userAcceptsBreak) {
      // Set the breakRemaining to the break duration
      this.breakRemaining = breakDurationInSeconds;
      this.isSubmitButtonActive = true;
      // Continue with the task duration timer
      this.startTimer(); 
    } else {
      // Implement logic for what to do when the user declines a break
    }
  }

  triggerSettings() {
    // Implement logic for what to do when the settings trigger button is clicked
    console.log("Settings Triggered!", this.patientForm);

    // Check if triggered by task duration
    if (this.patientForm.get('taskDuration')?.dirty) {
      // Reset the timer based on the task duration
      const taskDurationInSeconds = this.patientForm.value.taskDuration * 60;
      this.timeRemaining = taskDurationInSeconds;
      clearInterval(this.timerInterval); // Stop the previous timer
      this.startTimer(); // Start the new timer
    }
  }

  
  downloadRecords() {
    console.log(this.timeRemaining, "time Remaining")
    if (this.timeRemaining  = 0) {
      // Create CSV data
      const csvData: any[] = [];
      csvData.push(['Field', 'Value']); // Header
  
      // Add user inputs
      csvData.push(['Patient ID', this.patientForm.value.patientId]);
      csvData.push(['Interpretation', this.patientForm.value.interpretation]);
      csvData.push(['', '']); // Empty row for separation
  
      // Add summary
      csvData.push(['Total Record', this.totalRecord]);
      csvData.push(['Correct Record', this.correctRecord]);
      csvData.push(['Time Remaining', this.timeRemaining]);
      csvData.push(['', '']); // Empty row for separation
  
      // Add current patient details if available
      const currentData = this.data[this.randomNumber]?.currentPatientDetails;
      if (currentData) {
        csvData.push(['Current Patient Details']);
        // Flatten the nested structure
        Object.entries(currentData).forEach(([key, value]: [string, any]) => {
          if (typeof value === 'object') {
            // Flatten nested object
            Object.entries(value).forEach(([nestedKey, nestedValue]: [string, any]) => {
              csvData.push([`${key} - ${nestedKey}`, nestedValue.toString()]);
            });
          } else {
            csvData.push([key, value.toString()]);
          }
        });
        csvData.push(['', '']); // Empty row for separation
      }
  
      // Add patient records
      csvData.push(['Patient Records']);
      csvData.push(['Patient ID', 'Interpretation', 'Result', 'Timestamp']);
      this.allRecords.forEach(record => {
        csvData.push([record.currentPatientDetails.patientId,
           record.enteredInterpretation, 
           record.enteredResult, record.timestamp]);
      });
  
      // Convert CSV data to a string
      const csvString = Papa.unparse(csvData, { header: false });
  
      // Convert the string to a Blob
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
  
      // Save the Blob as a CSV file
      saveAs(blob, 'patient_records.csv');
    } else {
      alert("You can download the records after the session ends");
    }
  }
  
  
  isTimerBlockClicked() {

    if((this.isShowTimer === false) && this.isPasswordCorrect()) {
      this.isShowTimer = !this.isShowTimer
    } else if (this.isShowTimer === true) {
      this.isShowTimer = !this.isShowTimer
    }
  }

  isPasswordCorrect() {
    const enteredPassword = prompt("Enter the password");
  
    if (enteredPassword === this.password) {
      alert('Password is correct!');
      return true;
    } else {
      alert('Incorrect password. Try again.');
      return false;
    }
  }
  
  
}

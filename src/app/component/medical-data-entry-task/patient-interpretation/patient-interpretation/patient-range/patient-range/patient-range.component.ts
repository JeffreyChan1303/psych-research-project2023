// patient-range.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/service/session.service';
import { DataService } from 'src/app/service/data.service';
import { Interpretation } from '../../../../../../../../server/src/types';

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
  password = 'researcher2023';
  isSubmitButtonDisabled = false;
  breakAccepted: boolean = true; // Variable to store the break acceptance status
  breakTiming: any[] = [];
  sessionData:
    | {
        participantNumber: string;
        taskDurationSeconds: number;
        breakDurationSeconds: number;
        breakCountInterval: number;
        breakTimeIntervalSeconds: number;
        breakIntervalType: string;
      }
    | undefined;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    // get data from session
    const participantNumber = this.sessionService.getParticipantNumber();
    const sessionSettings = this.sessionService.getSessionSettings();
    if (!sessionSettings || !participantNumber) {
      alert('patient-range-init: Session settings not found!! Unable to start timer!!');
      this.router.navigate(['/patient-session']);
      return;
    }
    const taskDurationSeconds = sessionSettings.taskDurationSeconds;
    const breakDurationSeconds = sessionSettings.breakDurationSeconds;
    const breakCountInterval = sessionSettings.breakCountInterval;
    const breakTimeIntervalSeconds = sessionSettings.breakTimeIntervalSeconds;
    const breakIntervalType = sessionSettings.breakIntervalType;
    this.sessionData = {
      participantNumber: participantNumber,
      taskDurationSeconds: taskDurationSeconds,
      breakDurationSeconds: breakDurationSeconds,
      breakCountInterval: breakCountInterval,
      breakTimeIntervalSeconds: breakTimeIntervalSeconds,
      breakIntervalType: breakIntervalType
    };

    this.timeRemaining = taskDurationSeconds;

    this.patientForm = this.fb.group({
      patientId: ['', Validators.required],
      interpretation: [, Validators.required],
      taskDurationSeconds: [taskDurationSeconds, Validators.required], // Default task duration in seconds
      breakDurationSeconds: [breakDurationSeconds, Validators.required], // Default break duration in seconds
      breakTimeIntervalSeconds: [breakTimeIntervalSeconds, Validators.required], // Default break time interval in seconds
      breakCountInterval: [breakCountInterval, Validators.required],
      breakIntervalType: [breakIntervalType, Validators.required]
    });
  }

  onSubmit() {
    if (this.patientForm.invalid) {
      alert('NOT VALID');
      return;
    }
    this.formSubmitted.emit();
    this.checkIsDataInRange();

    // Check if the timer is already running
    if (!this.timerInterval) {
      this.startTimer();
    }

    const sessionId = this.sessionService.getSessionId();
    if (!sessionId) {
      console.error('Session ID not found!! Unable to submit!!');
      return;
    }

    // get lastInteraction
    let lastInteraction = 0;
    if (this.allRecords.length >= 2) {
      lastInteraction = this.getTimestampDifferenceInSeconds(
        this.allRecords[this.allRecords.length - 2].timestamp,
        new Date()
      );
    }

    // send the submission to the server (dataService)
    this.dataService
      .createSubmission({
        // things to add, given patient_id, and given_interpretation, if I'm not going to store the
        // This is how the submission data should look like!!!!!!!!!
        // given_patient_id
        // entered_patient_id: this.patientForm.value.patientId,
        // given_interpretation: this.patientForm.value.interpretation,
        // entered_interpretation: this.isDataValid(),
        // is_valid
        // session_id
        given_patient_id: this.data[this.randomNumber].patientId,
        entered_patient_id: this.patientForm.value.patientId,
        given_interpretation: this.isInCorrectRange() ? Interpretation['within range'] : Interpretation['out of range'],
        entered_interpretation: this.patientForm.value.interpretation,
        last_interaction: lastInteraction,
        is_valid: this.isDataValid(),
        session_id: sessionId
      })
      .subscribe((newSubmission) => {
        console.log('Create Submission Data: ', {
          ...newSubmission[0],
          created_at: new Date(newSubmission[0].created_at)
        });
      });

    // Reset the form
    this.patientForm.patchValue({
      patientId: '',
      interpretation: ''
    });
  }

  showProgress() {
    // if((this.isShowProgressClicked === false) && this.isPasswordCorrect()) {
    this.isShowProgressClicked = !this.isShowProgressClicked;
    // } else if (this.isShowProgressClicked === true) {
    // this.isShowProgressClicked = !this.isShowProgressClicked;
    // }
  }

  isInCorrectRange() {
    let currentData = this.data[this.randomNumber];
    let maleOrFemaleRange = currentData.sex === 'Male' ? currentData.maleRange : currentData.femaleRange;
    let minValue = maleOrFemaleRange.split('to')[0];
    let maxValue = maleOrFemaleRange.split('to')[1];
    return currentData.hr > minValue && currentData.hr < maxValue ? 'within range' : 'not within range';
  }
  isDataValid() {
    let currentData = this.data[this.randomNumber];

    if (
      currentData.patientId === this.patientForm.value.patientId &&
      this.isInCorrectRange() === this.patientForm.value.interpretation
    ) {
      return true;
    }
    return false;
  }

  checkIsDataInRange() {
    let currentData = this.data[this.randomNumber];
    let maleOrFemaleRange = currentData.sex === 'Male' ? currentData.maleRange : currentData.femaleRange;
    let minValue = maleOrFemaleRange.split('to')[0];
    let maxValue = maleOrFemaleRange.split('to')[1];

    let isInCorrectRange = currentData.hr > minValue && currentData.hr < maxValue ? 'within range' : 'not within range';
    if (
      currentData.patientId === this.patientForm.value.patientId &&
      isInCorrectRange === this.patientForm.value.interpretation
    ) {
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
      timestamp: new Date(),
      lastInteraction: 0
    };
    let lastInteraction = 0;

    if (this.allRecords.length >= 1) {
      lastInteraction = this.getTimestampDifferenceInSeconds(
        this.allRecords[this.allRecords.length - 1].timestamp,
        new Date()
      );
      record.lastInteraction = lastInteraction;
    }

    this.allRecords.push(record);

    console.log(this.patientForm.value.breakIntervalType, this.totalRecord, this.patientForm.value.breakCountInterval);
    // Introduce breaks based on conditions
    if (
      this.patientForm.value.breakIntervalType === 'count' &&
      this.totalRecord % this.patientForm.value.breakCountInterval === 0
    ) {
      this.showBreakPopup();
    }
  }

  getTimestampDifferenceInSeconds(start: Date, end: Date): number {
    const startTime = start.getTime();
    const endTime = end.getTime();

    const timeDifferenceInMilliseconds = endTime - startTime;
    const timeDifferenceInSeconds = Math.floor(timeDifferenceInMilliseconds / 1000);

    return timeDifferenceInSeconds;
  }
  startTimer() {
    // keep track of time Spent for the break interval
    let timeSpent = 0;
    this.timerInterval = setInterval(() => {
      if (this.breakRemaining > 1) {
        this.breakRemaining--;
        this.isSubmitButtonDisabled = true;
      } else if (this.breakRemaining === 1) {
        this.breakRemaining--;
        this.isSubmitButtonDisabled = false;
      } else if (this.timeRemaining > 1) {
        timeSpent++;
        this.timeRemaining--;
        this.isSubmitButtonDisabled = false;
        // check if its a break time
        if (
          this.patientForm.value.breakIntervalType === 'time' &&
          timeSpent % this.patientForm.value.breakTimeIntervalSeconds === 0
        ) {
          this.showBreakPopup();
        }
      } else if (this.timeRemaining === 1) {
        timeSpent++;
        this.timeRemaining--;
        this.isSubmitButtonDisabled = true;
        alert('This session has ended. Refresh the page to start a new session.');
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  originalStartTimer() {
    if (this.timeRemaining === 0) {
      this.isSubmitButtonDisabled = false;
    }
    // Check if there is remaining break time
    if (this.breakRemaining > 0) {
      // If there is, decrease breakRemaining
      this.breakRemaining--;
      // this.isSubmitButtonActive = false;
    } else {
      // Otherwise, continue with the task duration timer
      const taskDurationInSeconds =
        this.timeRemaining > 0 ? this.timeRemaining : this.patientForm.value.taskDurationSeconds;

      // Store the start time to consider the existing countdown time
      const startTime = Date.now() - (this.patientForm.value.taskDurationSeconds - this.timeRemaining) * 1000;

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
          if (this.breakRemaining === 0) {
            this.isSubmitButtonDisabled = false;
          }
        } else {
          clearInterval(this.timerInterval);

          // If a break is needed, set breakRemaining to the break duration
          this.breakRemaining = this.patientForm.value.breakDurationSeconds;
          this.startTimer(); // Start the new timer (for the break)
        }
      }, 1000); // Update every second
    }
    console.log(this.timeRemaining);
  }

  showBreakPopup() {
    // Display the popup
    const userAcceptsBreak = confirm('Take a break?');
    // add the break dataService create call in this if block so create a break time in the database
    if (userAcceptsBreak) {
      // Set the breakRemaining to the break duration
      this.breakRemaining = this.patientForm.value.breakDurationSeconds;
      this.isSubmitButtonDisabled = true;
      this.breakTiming.push({
        isBreakAccepted: true,
        time: new Date()
      });
      // Continue with the task duration timer
      // this.startTimer(); // removed because the timer will never stop
    } else {
      this.breakAccepted = false;
      this.breakTiming.push({
        isBreakAccepted: false,
        time: new Date()
      });
      console.log('Break declined by user');
    }

    // check if session initialization failed!!
    const sessionId = this.sessionService.getSessionId();
    if (!sessionId) {
      alert('Session ID not found!! Unable to create break!!');
      return;
    }
    // send the break to the server (dataService)
    this.dataService
      .createBreak({
        session_id: sessionId,
        has_accepted: userAcceptsBreak
      })
      .subscribe((newBreak) => {
        console.log('Create Break Data: ', {
          ...newBreak[0],
          created_at: new Date(newBreak[0].created_at)
        });
      });
  }

  triggerSettings() {
    // Implement logic for what to do when the settings trigger button is clicked
    console.log('Settings Triggered!', this.patientForm);

    // Check if triggered by task duration
    if (
      this.patientForm.get('taskDurationSeconds')?.dirty ||
      this.patientForm.get('breakDurationSeconds')?.dirty ||
      this.patientForm.get('breakCountInterval')?.dirty ||
      this.patientForm.get('breakTimeIntervalSeconds')?.dirty ||
      this.patientForm.get('breakIntervalType')?.dirty
    ) {
      // Reset the timer based on the task duration
      this.timeRemaining = this.patientForm.value.taskDurationSeconds;
      clearInterval(this.timerInterval); // Stop the previous timer
      this.startTimer(); // Start the new timer

      if (!this.sessionData?.participantNumber) {
        alert('Session participant number not found!! Unable to update participant settings!!');
        return;
      }
      // update participant settings in the server
      this.dataService
        .updateParticipantSettings({
          participant_number: this.sessionData.participantNumber,
          task_duration_seconds: this.patientForm.value.taskDurationSeconds,
          break_duration_seconds: this.patientForm.value.breakDurationSeconds,
          break_count_interval: this.patientForm.value.breakCountInterval,
          break_time_interval_seconds: this.patientForm.value.breakTimeIntervalSeconds,
          break_interval_type: this.patientForm.value.breakIntervalType
        })
        .subscribe((updatedParticipant) => {
          console.log('Update Participant Data: ', updatedParticipant);
          alert('Participant settings updated successfully!');
        });
    }
  }

  downloadDataFromDatabase() {
    const participantNumber = this.sessionService.getParticipantNumber();
    if (!participantNumber) {
      alert('Participant Number not found!! Unable to download data!!');
      return;
    }
    this.dataService.getSubmissionsAndBreaksByParticipantNumber(participantNumber.toString()).subscribe((data) => {
      console.log('get Submissions and break data from server: ', data);
    });
  }
  downloadRecords() {
    // here, this should be covered under the Admin panel button, and should use the getSubmissions and getBreaks, and should parse these into the csv!!
    console.log(this.timeRemaining, 'time Remaining');
    if (this.timeRemaining === 0) {
      // Create CSV data
      const csvData: any[] = [];
      csvData.push(['Field', 'Value']); // Header

      // Add user inputs
      csvData.push(['Participant ID', this.sessionService.getParticipantNumber()]);
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
      csvData.push(['Patient ID', 'Interpretation', 'Result', 'Timestamp', 'Last Interaction']);
      this.allRecords.forEach((record) => {
        csvData.push([
          record.currentPatientDetails.patientId,
          record.enteredInterpretation,
          record.enteredResult,
          record.timestamp.toLocaleString('en-US', { timeZone: 'America/New_York' }),
          record.lastInteraction
        ]);
      });

      csvData.push(['', '']);
      csvData.push(['breakAccepted', 'TimeAcceptedOrDeclined']);
      this.breakTiming.forEach((eachTime) => {
        csvData.push([
          eachTime.isBreakAccepted,
          eachTime.time.toLocaleString('en-US', { timeZone: 'America/New_York' })
        ]);
      });

      // Convert CSV data to a string
      const csvString = Papa.unparse(csvData, { header: false });

      // Convert the string to a Blob
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });

      // Save the Blob as a CSV file
      saveAs(blob, 'patient_records.csv');
    } else {
      alert('You can download the records after the session ends');
    }
  }

  isTimerBlockClicked() {
    if (this.isShowTimer === false && this.isPasswordCorrect()) {
      this.isShowTimer = !this.isShowTimer;
    } else if (this.isShowTimer === true) {
      this.isShowTimer = !this.isShowTimer;
    }
  }

  isPasswordCorrect() {
    const enteredPassword = prompt('Enter the password');

    if (enteredPassword === this.password) {
      alert('Password is correct!');
      return true;
    } else {
      alert('Incorrect password. Try again.');
      return false;
    }
  }
}

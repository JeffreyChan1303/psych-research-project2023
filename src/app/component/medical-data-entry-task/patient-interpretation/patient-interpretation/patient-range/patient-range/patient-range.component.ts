// patient-range.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/service/session.service';
import { DataService } from 'src/app/service/data.service';
import { Interpretation } from '../../../../../../../../server/src/types';

import { saveBlobAsFile } from 'src/utils/file-saver';
import { unparseToCsvString } from 'src/utils/csvUtil';

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
  timeoutRemaining: number = 300;
  sessionData:
    | {
        participantNumber: string;
        taskDurationSeconds: number;
        breakDurationSeconds: number;
        breakCountInterval: number;
        breakTimeIntervalSeconds: number;
        breakIntervalType: string;
        sessionTimeoutSeconds: number;
        showProgressToggle: boolean;
      }
    | undefined;
  isShowStatistics: boolean = false;

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
      breakIntervalType: breakIntervalType,
      sessionTimeoutSeconds: sessionSettings.sessionTimeoutSeconds,
      showProgressToggle: sessionSettings.showProgressToggle
    };

    this.isShowStatistics = this.sessionData.showProgressToggle;
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

    // reset the inactivity timeout timer
    if (this.sessionData) {
      this.timeoutRemaining = this.sessionData.sessionTimeoutSeconds;
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
        given_patient_id: this.data[this.randomNumber].patientId,
        entered_patient_id: this.patientForm.value.patientId,
        given_interpretation: this.getPatientExpectedRange(),
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
    this.isShowProgressClicked = !this.isShowProgressClicked;
  }

  getPatientExpectedRange() {
    let currentData = this.data[this.randomNumber];
    let maleOrFemaleRange = currentData.sex === 'Male' ? currentData.maleRange : currentData.femaleRange;
    let minValue = maleOrFemaleRange.split('to')[0];
    let maxValue = maleOrFemaleRange.split('to')[1];
    return currentData.hr > minValue && currentData.hr < maxValue
      ? Interpretation['within range']
      : Interpretation['out of range'];
  }
  compareStrings(a: string, b: string) {
    return a.toLowerCase() === b.toLowerCase();
  }
  isDataValid() {
    let currentData = this.data[this.randomNumber];
    if (
      this.compareStrings(currentData.patientId, this.patientForm.value.patientId) &&
      this.getPatientExpectedRange() === this.patientForm.value.interpretation
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
    if (this.isDataValid()) {
      this.correctRecord += 1;
      this.totalRecord += 1;
    } else {
      this.totalRecord += 1;
    }

    const record = {
      currentPatientDetails: this.data[this.randomNumber],
      enteredPatientId: this.patientForm.value.patientId,
      isPatientIdValid: this.compareStrings(currentData.patientId, this.patientForm.value.patientId),
      enteredInterpretation: this.patientForm.value.interpretation,
      isInterpretationValid: this.patientForm.value.interpretation === this.getPatientExpectedRange(),
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
    clearInterval(this.timerInterval); // Clear the previous timer if any
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
        this.timeoutRemaining--;
        this.isSubmitButtonDisabled = false;
        // check if its a break time
        if (
          this.patientForm.value.breakIntervalType === 'time' &&
          timeSpent % this.patientForm.value.breakTimeIntervalSeconds === 0
        ) {
          this.showBreakPopup();
        }

        // kick user out if they are inactive for more than the sessionTimeoutSeconds
        const sessionId = this.sessionService.getSessionId();
        const sessionTimeoutSeconds = this.sessionData?.sessionTimeoutSeconds;
        if (!sessionId || !sessionTimeoutSeconds) {
          alert('Session data not found!! Unable to check for session timeout!!');
          return;
        }
        if (this.timeoutRemaining === 0) {
          this.dataService
            .createSubmission({
              given_patient_id: 'timeout',
              entered_patient_id: 'timeout',
              given_interpretation: Interpretation['within range'],
              entered_interpretation: Interpretation['within range'],
              last_interaction: sessionTimeoutSeconds,
              is_valid: false,
              session_id: sessionId
            })
            .subscribe((newSubmission) => {
              alert(
                `Session timed out!! ${this.sessionData?.sessionTimeoutSeconds} seconds have passed without submissions!!`
              );
              clearInterval(this.timerInterval);
              this.router.navigate(['/patient-session']);
            });
        }
      } else if (this.timeRemaining === 1) {
        timeSpent++;
        this.timeRemaining--;
        this.isSubmitButtonDisabled = true;
        alert('You have completed this session. Please download your records and send to your researcher.');
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  toggleShowStatistics() {
    this.isShowStatistics = !this.isShowStatistics;
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
    } else {
      this.breakAccepted = false;
      this.breakTiming.push({
        isBreakAccepted: false,
        time: new Date()
      });
      console.log('Break declined by user');
    }
    // Continue with the task duration timer
    this.startTimer();

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

  downloadRecords() {
    // here, this should be covered under the Admin panel button, and should use the getSubmissions and getBreaks, and should parse these into the csv!!
    console.log(this.timeRemaining, 'time Remaining');
    if (this.timeRemaining > 0) {
      alert('You can download the records after the session ends');
      return;
    }

    // Create CSV data
    const csvData: any[] = [];
    csvData.push(['Field', 'Value']); // Header

    // Add user inputs
    csvData.push(['Participant ID', this.sessionService.getParticipantNumber()]);
    csvData.push(['Session Id', this.sessionService.getSessionId()]);
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
    csvData.push([
      'Given Patient ID',
      'Entered Patient Id',
      'Is Patient Id Valid',
      'Entered Interpretation',
      'Is Interpretation Valid',
      'Timestamp',
      'Last Interaction'
    ]);
    this.allRecords.forEach((record) => {
      csvData.push([
        record.currentPatientDetails.patientId,
        record.enteredPatientId,
        record.isPatientIdValid,
        record.enteredInterpretation,
        record.isInterpretationValid,
        record.timestamp.toLocaleString('en-US', { timeZone: 'America/New_York' }),
        record.lastInteraction
      ]);
    });

    csvData.push(['', '']);
    csvData.push(['breakAccepted', 'TimeAcceptedOrDeclined']);
    this.breakTiming.forEach((eachTime) => {
      csvData.push([eachTime.isBreakAccepted, eachTime.time.toLocaleString('en-US', { timeZone: 'America/New_York' })]);
    });

    // Convert CSV data to a string
    const csvString = unparseToCsvString(csvData);

    // Convert the string to a Blob
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });

    // Save the Blob as a CSV file
    saveBlobAsFile(blob, `patient_${this.sessionService.getParticipantNumber()}_records.csv`);
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

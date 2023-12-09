import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/service/session.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-patient-session',
  templateUrl: './patient-session.component.html',
  styleUrls: ['./patient-session.component.css']
})
export class PatientSessionComponent implements OnInit {
  participantForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private sessionService: SessionService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.participantForm = this.formBuilder.group({
      participantNumber: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  startSession() {
    if (this.participantForm.valid) {
      // You can access the entered participant number using this.participantForm.value.participantNumber
      // this.router.navigate(['/data-entry-task']);

      // save the session participant id into the session service
      this.sessionService.setParticipantNumber(this.participantForm.value.participantNumber);
      // get the participant data from the server, so we can load the participant settings for task time, break time, etc.
      this.dataService.getParticipantByParticipantNumber(this.participantForm.value.participantNumber).subscribe(
        (participantData) => {
          console.log('participantData: ', participantData);
          // set the session settings
          this.sessionService.setSessionSettings({
            breakCountInterval: participantData[0].break_count_interval,
            breakTimeIntervalSeconds: participantData[0].break_time_interval_seconds,
            taskDurationSeconds: participantData[0].task_duration_seconds,
            breakDurationSeconds: participantData[0].break_duration_seconds,
            breakIntervalType: participantData[0].break_interval_type
          });

          // create a new session
          this.dataService
            .createSession({
              participant_number: this.participantForm.value.participantNumber,
              task_duration_seconds: participantData[0].task_duration_seconds,
              break_duration_seconds: participantData[0].break_duration_seconds,
              break_count_interval: participantData[0].break_count_interval,
              break_time_interval_seconds: participantData[0].break_time_interval_seconds,
              break_interval_type: participantData[0].break_interval_type
            })
            .subscribe((newSession) => {
              console.log('Create Session Data: ', {
                ...newSession[0],
                created_at: new Date(newSession[0].created_at)
              });
              // save the session id into the session service
              // so I can refer back when I create a new submission or break
              this.sessionService.setSessionId(newSession[0].id);
              // navigate when the session is created
              this.router.navigate(['/data-entry-task']);
            });
        },
        (error) => {
          console.log('error: ', error);
          alert('an error occurred when accessing the server. Please try again later.');
        }
      );
    } else {
      alert(
        'Please double check the participant number and try again. it should be three digit between 100 to 999 inclusive.'
      );
    }
  }
}

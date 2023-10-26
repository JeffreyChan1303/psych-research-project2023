  import { Component, EventEmitter, Input, Output } from '@angular/core';

  @Component({
    selector: 'app-patient-interpretation',
    templateUrl: './patient-interpretation.component.html',
    styleUrls: ['./patient-interpretation.component.css']
  })
  export class PatientInterpretationComponent {
    @Input() data: any;
    @Input() randomNumber!: number;
    @Output() formSubmitted = new EventEmitter<void>();

    handleFormSubmission() {
      this.formSubmitted.emit();
    }

  }

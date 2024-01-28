import { Component, Input, OnChanges, OnInit, SimpleChanges, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from 'src/app/pop-up/pop-up.component';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnChanges {
  @Input() data: any;
  @Input() randomNumber!: number;
  patientForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private dialogRef: MatDialog) {}

  // quick fix for copy/paste requirement
  @HostListener('copy', ['$event'])
  onCopy(event: ClipboardEvent) {
    event.preventDefault();
    this.dialogRef.open(PopUpComponent, {
      data: {
        textContent: 'Copying from patient data not allowed!!!',
        confirmText: 'OK',
        confirmFunction: () => {
          this.dialogRef.closeAll();
        },
        cancelText: '',
        cancelFunction: () => {}
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.assignFormValue(this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      console.log(this.randomNumber);
      this.initForm();
      this.assignFormValue(this.data);
    }
  }

  initForm() {
    // Create an empty form
    this.patientForm = this.formBuilder.group({
      patientName: ['', Validators.required],
      dob: ['', Validators.required],
      currentAge: ['', Validators.required],
      sex: ['', Validators.required],
      patientId: ['', Validators.required],
      hr: ['', Validators.required],
      qtIntervals: ['', Validators.required]
    });

    // After initializing the form, you can call assignFormValue if needed
    this.assignFormValue(this.data);
  }

  assignFormValue(data: string | any[]) {
    if (Array.isArray(data) && data.length > 0) {
      const firstPatient = data[this.randomNumber];

      // Patch the values if data is available
      this.patientForm.patchValue({
        patientName: firstPatient.patientName,
        dob: firstPatient.dob,
        currentAge: firstPatient.currentAge,
        sex: firstPatient.sex,
        patientId: firstPatient.patientId,
        hr: firstPatient.hr,
        qtIntervals: firstPatient.qtIntervals
      });

      // Log the data after it's patched into the form
      // console.log(this.patientForm.value);
    }
  }
}

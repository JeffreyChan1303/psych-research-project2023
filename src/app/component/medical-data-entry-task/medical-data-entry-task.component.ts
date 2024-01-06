import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';
import type { PatientData } from 'src/utils/patientGenerator';

@Component({
  selector: 'app-medical-data-entry-task',
  templateUrl: './medical-data-entry-task.component.html',
  styleUrls: ['./medical-data-entry-task.component.css']
})
export class MedicalDataEntryTaskComponent implements OnInit {
  data: PatientData[] = [];
  randomNumber!: number;
  constructor(private dataService: DataService) {}

  // this.loadDate('assets/data.json'); this is the original code. dummy fetch data like a api call
  // this.generatePatientData(); this is the new code. generates random data using faker.
  ngOnInit() {
    this.data = this.dataService.getRandomPatientData();
    this.randomNumber = 0;
  }

  // refreshes data using when user submits the form
  handleFormSubmission() {
    this.data = this.dataService.getRandomPatientData();
    this.randomNumber = 0;
  }

  loadData(jsonPath: string) {
    this.dataService.getData(jsonPath).subscribe(
      (data) => {
        this.data = data;
      },
      (error) => {
        console.error('Error loading JSON data:', error);
      }
    );

    this.randomNumber = Math.floor(Math.random() * 21);
  }
}

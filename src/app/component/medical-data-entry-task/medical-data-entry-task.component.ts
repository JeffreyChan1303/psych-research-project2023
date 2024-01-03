import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { DataService } from 'src/app/service/data.service';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-medical-data-entry-task',
  templateUrl: './medical-data-entry-task.component.html',
  styleUrls: ['./medical-data-entry-task.component.css']
})
export class MedicalDataEntryTaskComponent implements OnInit {
  data: any;
  randomNumber!: number;
  constructor(private dataService: DataService) {}

  // this.loadDate('assets/data.json'); this is the original code. dummy fetch data like a api call
  // this.generatePatientData(); this is the new code. generates random data using faker.
  ngOnInit() {
    this.generatePatientData();
  }

  // refreshes data using when user submits the form
  handleFormSubmission() {
    this.generatePatientData();
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

  generatePatientData() {
    // 0 = male, 1 = female
    const gender = faker.person.sex() as 'male' | 'female';
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName(gender);
    const patientName = firstName + ' ' + lastName;

    // generate a random date of birth
    const dob: Date = faker.date.birthdate({ min: 1934, max: 2020, mode: 'year' });

    // calculate age
    const today = new Date();
    let currentAge = today.getFullYear() - dob.getFullYear();
    const monthsDiff = today.getMonth() - dob.getMonth();
    // Adjust age if birthday hasn't occurred yet this year
    if (monthsDiff < 0 || (monthsDiff === 0 && today.getDate() < dob.getDate())) {
      currentAge -= 1;
    }

    const sex = gender.charAt(0).toUpperCase() + gender.slice(1);

    // generate patient id
    const patientIdString = faker.string.alpha({ length: 3 }).toUpperCase();
    const patientIdNumber = faker.number.int({ min: 0, max: 999 }).toString().padStart(3, '0');
    const patientId = `${patientIdString}-${patientIdNumber}`;

    const hr = faker.number.int({ min: 70, max: 170 });
    const qtIntervals = faker.number.float({ min: 0.1, max: 0.5, precision: 0.02 }).toPrecision(2);

    // male and female ranges
    const femaleRangeMin = faker.number.int({ min: 70, max: 100 });
    const femaleRangeMax = faker.number.int({ min: 110, max: 165 });
    const femaleRange = `${femaleRangeMin} to ${femaleRangeMax}`;

    const maleRangeMin = faker.number.int({ min: 70, max: 100 });
    const maleRangeMax = faker.number.int({ min: 110, max: 165 });
    const maleRange = `${maleRangeMin} to ${maleRangeMax}`;

    const data = [
      {
        patientName,
        dob: dob.toISOString().split('T')[0],
        currentAge,
        sex,
        patientId,
        hr,
        qtIntervals,
        femaleRange,
        maleRange
      }
    ];

    // update the state of the patient data
    this.data = data;
    this.randomNumber = 0;
    return data;
  }
}

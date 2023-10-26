import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { DataService } from 'src/app/service/daata.service';

@Component({
  selector: 'app-medical-data-entry-task',
  templateUrl: './medical-data-entry-task.component.html',
  styleUrls: ['./medical-data-entry-task.component.css']
})
export class MedicalDataEntryTaskComponent implements OnInit {
  data: any 
  randomNumber!: number;
  constructor(
    private dataService: DataService
  ) {}

  ngOnInit() {
    // Load data from different sources
    this.loadData('assets/data.json');
    // You can load data from multiple sources as needed
  }

  loadData(jsonPath: string) {
    this.dataService.getData(jsonPath).subscribe(
      data => {
        this.data = data;
      },
      error => {
        console.error('Error loading JSON data:', error);
      }
    );
    
    this.randomNumber = Math.floor(Math.random() * 21); 
  }

  handleFormSubmission() {
    // Make an API call to update the data
    // For example:
    // this.dataService.updateData().subscribe(updatedData => {
    //   this.data = updatedData;
    // });

    // For now, let's simulate an update by reloading the data
    this.loadData('assets/data.json');
  }
}

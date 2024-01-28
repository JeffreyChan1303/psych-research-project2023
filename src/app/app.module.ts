import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientSessionComponent } from './component/patient-session/patient-session.component';
import { MedicalDataEntryTaskComponent } from './component/medical-data-entry-task/medical-data-entry-task.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientDetailsComponent } from './component/medical-data-entry-task/patient-details/patient-details/patient-details.component';
import { PatientInterpretationComponent } from './component/medical-data-entry-task/patient-interpretation/patient-interpretation/patient-interpretation.component';
import { PatientMaleFemaleComponent } from './component/medical-data-entry-task/patient-interpretation/patient-interpretation/patient-male-female/patient-male-female/patient-male-female.component';
import { PatientRangeComponent } from './component/medical-data-entry-task/patient-interpretation/patient-interpretation/patient-range/patient-range/patient-range.component';
import { HttpClientModule } from '@angular/common/http';
import { FormatTimePipe } from './service/formate-time.pipe';
import { AdminPanelComponent } from './component/admin-panel/admin-panel.component';
import { PopUpComponent } from './pop-up/pop-up.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientSessionComponent,
    MedicalDataEntryTaskComponent,
    PatientDetailsComponent,
    PatientInterpretationComponent,
    PatientMaleFemaleComponent,
    PatientRangeComponent,
    AdminPanelComponent,
    FormatTimePipe,
    PopUpComponent
  ],
  imports: [InputNumberModule, BrowserModule, AppRoutingModule, ReactiveFormsModule, HttpClientModule, MatDialogModule],
  providers: [],
  bootstrap: [AppComponent]
  // schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}

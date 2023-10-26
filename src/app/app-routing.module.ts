import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PatientSessionComponent} from './component/patient-session/patient-session.component';
import {MedicalDataEntryTaskComponent} from './component/medical-data-entry-task/medical-data-entry-task.component';

const routes: Routes = [
  { path: '', redirectTo: '/patient-session', pathMatch: 'full' },
  { path: 'patient-session', component: PatientSessionComponent},
  { path: 'data-entry-task', component: MedicalDataEntryTaskComponent },
  // Add more routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientSessionComponent } from './component/patient-session/patient-session.component';
import { MedicalDataEntryTaskComponent } from './component/medical-data-entry-task/medical-data-entry-task.component';
import { AdminPanelComponent } from './component/admin-panel/admin-panel.component';

const routes: Routes = [
  { path: 'patient-session', component: PatientSessionComponent },
  { path: 'data-entry-task', component: MedicalDataEntryTaskComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: '**', redirectTo: '/patient-session' }

  // Add more routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

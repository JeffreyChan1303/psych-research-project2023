// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getData(jsonPath: string): Observable<any> {
    return this.http.get<any>(jsonPath);
  }

  getParticipantByParticipantNumber(
    participant_number: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/participantByParticipantNumber/${participant_number}`
    );
  }

  // this will be get csv file. need to fix this, needs session info
  getSubmissionsAndBreakInfoByPatientId(
    participant_number: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/allSubmissionsByParticipantNumber/${participant_number}`
    );
  }

  createBreak(values: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createBreak`, values);
  }
  createSubmission(values: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createSubmission`, values);
  }
  createSession(values: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createSession`, values);
  }
}

import { Injectable } from '@angular/core';
import { SessionInputModel } from 'server/src/types';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  protected participantNumber: string | undefined;
  protected sessionId: number | undefined;
  protected sessionSettings:
    | {
        taskDurationSeconds: number;
        breakDurationSeconds: number;
        breakCountInterval: number;
        breakTimeIntervalSeconds: number;
        breakIntervalType: string;
        sessionTimeoutSeconds: number;
        showProgressToggle: boolean;
      }
    | undefined;

  constructor() {}

  getParticipantNumber(): string | undefined {
    return this.participantNumber;
  }

  setParticipantNumber(participantNumber: string): void {
    this.participantNumber = participantNumber;
  }

  getSessionId(): number | undefined {
    return this.sessionId;
  }
  setSessionId(sessionId: number): void {
    this.sessionId = sessionId;
  }

  getSessionSettings(): any {
    return this.sessionSettings;
  }
  setSessionSettings(sessionSettings: {
    taskDurationSeconds: number;
    breakDurationSeconds: number;
    breakCountInterval: number;
    breakTimeIntervalSeconds: number;
    breakIntervalType: string;
    sessionTimeoutSeconds: number;
    showProgressToggle: boolean;
  }): void {
    this.sessionSettings = sessionSettings;
  }
}

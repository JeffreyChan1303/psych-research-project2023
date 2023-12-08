import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  protected participantNumber: Number | undefined;

  constructor() {}

  getParticipantNumber(): Number | undefined {
    return this.participantNumber;
  }

  setParticipantNumber(participantNumber: Number): void {
    this.participantNumber = participantNumber;
  }
}

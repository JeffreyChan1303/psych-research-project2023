export enum BreakIntervalType {
  'count',
  'time'
}
export interface ParticipantViewModel {
  id: number;
  participant_number: string;
  full_name: string;
  task_duration_seconds: number;
  break_duration_seconds: number;
  break_count_interval: number;
  break_time_interval_seconds: number;
  break_interval_type: BreakIntervalType;
  created_at: Date;
}

export interface SessionViewModel {
  id: number;
  participant_number: string;
  task_duration_seconds: number;
  break_duration_seconds: number;
  break_count_interval: number;
  break_time_interval_seconds: number;
}

export enum Interpretation {
  'within range' = 'within range',
  'out of range' = 'out of range'
}
export interface SubmissionInputModel {
  session_id: number;
  given_patient_id: string;
  entered_patient_id: string;
  given_interpretation: Interpretation;
  entered_interpretation: Interpretation;
  last_interaction: number;
  is_valid: boolean;
}

export interface SessionInputModel {
  participant_number: string;
  task_duration_seconds: number;
  break_duration_seconds: number;
  break_count_interval: number;
  break_time_interval_seconds: number;
  break_interval_type: BreakIntervalType;
}

export interface UpdateParticipantInputModel {
  participant_number: string;
  task_duration_seconds: number;
  break_duration_seconds: number;
  break_count_interval: number;
  break_time_interval_seconds: number;
  break_interval_type: BreakIntervalType;
}

export interface BreakInputModel {
  session_id: number;
  has_accepted: boolean;
}

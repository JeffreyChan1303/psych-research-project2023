import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../models';
import { SubmissionInputModel } from '../types';

export const findSubmissionById = async (id: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>('SELECT * FROM Submissions WHERE id = ?;', [id]);
  console.log(rows);
  return rows;
};
export const findAllSubmissions = async () => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>('SELECT * FROM Submissions');
  console.log(rows);
  return rows;
};

// get submissions info
//   select sub.id, sub.session_id, sub.created_at, sub.patient_id, sub.interpretation, sub.last_interaction, sub.is_valid from submissions sub left join sessions s on sub.session_id = s.id where s.participant_number = 167;
export const findAllSubmissionsByParticipantNumber = async (participant_number: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>(
    'SELECT sub.id, sub.session_id, sub.created_at, sub.given_patient_id, sub.entered_patient_id, sub.given_interpretation, sub.entered_interpretation, sub.last_interaction, sub.is_valid FROM Submissions sub LEFT JOIN Sessions s ON sub.session_id = s.id WHERE s.participant_number = ?;',
    [participant_number]
  );
  console.log(rows);
  return rows;
};

// create submission info
//   INSERT INTO Submissions (session_id, patient_id, interpretation, last_interaction, is_valid) VALUES (1, 'pid-1', 'within range', 6, true)
export const insertSubmission = async (params: SubmissionInputModel) => {
  const queryData = await pool.query<ResultSetHeader>(
    'INSERT INTO Submissions (session_id, given_patient_id, entered_patient_id, given_interpretation, entered_interpretation, last_interaction, is_valid) VALUES (?, ?, ?, ?, ?, ?, ?);',
    [
      params.session_id,
      params.given_patient_id,
      params.entered_patient_id,
      params.given_interpretation,
      params.entered_interpretation,
      params.last_interaction,
      params.is_valid
    ]
  );
  console.log(queryData);
  return queryData;
};

import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../models';

export const findSessionById = async (id: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>('SELECT * FROM Sessions WHERE id = ?;', [id]);
  console.log(rows);
  return rows;
};

// get logging info
//   select count(id) from Sessions where participant_number = participant_number;
export const findSessionsByParticipantNumber = async (participant_number: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>('SELECT * FROM Sessions WHERE participant_number = ?;', [
    participant_number
  ]);
  console.log(rows);
  return rows;
};

// create logging info ()
//   insert into Sessions (participant_number, duration) values (participant_number, duration);
export const insertSession = async (participant_number: number, duration: number) => {
  const queryData = await pool.query<ResultSetHeader>(
    'INSERT INTO Sessions (participant_number, duration) VALUES (?, ?);',
    [participant_number, duration]
  );
  console.log(queryData);
  return queryData;
};

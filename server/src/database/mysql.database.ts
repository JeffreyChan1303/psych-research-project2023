import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export const showTables = async () => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>('show tables;');
  console.log(rows);
  return rows;
};

// function for when participant logs in, to get the settings
export const findParticipantByParticipantNumber = async (
  participant_number: string
) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM Participants WHERE participant_number = ?;',
    [participant_number]
  );
  console.log(rows);
  return rows;
};

export const findParticipantById = async (id: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM Participants WHERE id = ?;',
    [id]
  );
  console.log(rows);
  return rows;
};

export const findBreakById = async (id: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM Breaks WHERE id = ?;',
    [id]
  );
  console.log(rows);
  return rows;
};
export const findSubmissionById = async (id: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM Submissions WHERE id = ?;',
    [id]
  );
  console.log(rows);
  return rows;
};
export const findSessionById = async (id: string) => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM Sessions WHERE id = ?;',
    [id]
  );
  console.log(rows);
  return rows;
};

export const findAllSubmissions = async () => {
  const [rows, queryData] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM Submissions'
  );
  console.log(rows);
  return rows;
};

// the queries that we will need to use

// get participant info
//   select * from Participants where participant_number = participant_number;

// BELOW 3 Queries can be combined into 1 query for admin to retrieve all info of a session!! or a group of sessions!!!
// get break info
//   select * from Breaks where session_id = session_id;

// get submission info
//   select * from Submissions where session_id = session_id;

// get logging info
//   select count(id) from Sessions where participant_number = participant_number;

// create break into
//   INSERT INTO Breaks (session_id, has_accepted, duration) VALUES (1, true, 4)
export const insertBreak = async (
  session_id: number,
  has_accepted: boolean,
  duration: number
) => {
  const queryData = await pool.query<ResultSetHeader>(
    'INSERT INTO Breaks (session_id, has_accepted, duration) VALUES (?, ?, ?);',
    [session_id, has_accepted, duration]
  );
  console.log(queryData);
  return queryData;
};

// create submission info
//   INSERT INTO Submissions (session_id, patient_id, interpretation, last_interaction, is_valid) VALUES (1, 'pid-1', 'within range', 6, true)
export const insertSubmission = async (
  session_id: number,
  patient_id: string,
  interpretation: string,
  last_interaction: number,
  is_valid: boolean
) => {
  const queryData = await pool.query<ResultSetHeader>(
    'INSERT INTO Submissions (session_id, patient_id, interpretation, last_interaction, is_valid) VALUES (?, ?, ?, ?, ?);',
    [session_id, patient_id, interpretation, last_interaction, is_valid]
  );
  console.log(queryData);
  return queryData;
};

// create logging info ()
//   insert into Sessions (participant_number, duration) values (participant_number, duration);
export const insertSession = async (
  participant_number: number,
  duration: number
) => {
  const queryData = await pool.query<ResultSetHeader>(
    'INSERT INTO Sessions (participant_number, duration) VALUES (?, ?);',
    [participant_number, duration]
  );
  console.log(queryData);
  return queryData;
};

// create participant info (will have 2 functions, 1 for automatic creation and 1 for manual creation)
//   insert into Participants (participant_number, full_name, task_duration, break_duration, break_count_interval, break_time_interval) values (participant_number, full_name, task_duration, break_duration, break_count_interval, break_time_interval);
export const insertParticipant = async (
  participant_number: number,
  full_name: string,
  task_duration: number,
  break_duration: number,
  break_count_interval: number,
  break_time_interval: number
) => {
  const queryData = await pool.query<ResultSetHeader>(
    'INSERT INTO Participants (participant_number, full_name, task_duration, break_duration, break_count_interval, break_time_interval) VALUES (?, ?, ?, ?, ?, ?);',
    [
      participant_number,
      full_name,
      task_duration,
      break_duration,
      break_count_interval,
      break_time_interval,
    ]
  );
  console.log(queryData);
  return queryData;
};

// update settings
//   update participant set task_duration = xxx, break_duration = xxx, break_count_interval = xxx, break_time_interval = xxx where participant_number = participant_number;
export const updateParticipantSettings = async (
  task_duration: number,
  break_duration: number,
  break_count_interval: number,
  break_time_interval: number,
  participant_number: number
) => {
  const queryData = await pool.query<ResultSetHeader>(
    'UPDATE Participants SET task_duration = ?, break_duration = ?, break_count_interval = ?, break_time_interval = ? WHERE participant_number = ?;',
    [
      task_duration,
      break_duration,
      break_count_interval,
      break_time_interval,
      participant_number,
    ]
  );
  console.log(queryData);
  return queryData;
};

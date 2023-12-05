import express from 'express';
import mysql from 'mysql2';
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

const app = express();
const port = process.env.MYSQL_PORT || 3000;

app.listen(port, () => {
  console.log(`MedTask Server listening at http://localhost:${port}`);
});

app.get('/', async (req, res) => {
  const response = await pool.query('show tables;');
  // const response = await pool.query('SELECT * FROM Sessions');
  console.log(response);
  res.send(response);
  return response;
});

app.get('/participant', async (req, res) => {
  try {
    const response = await pool.query(
      'SELECT * FROM Participants WHERE participant_number = ?',
      [req.query.id]
    );
    console.log(response);
    res.send(response);
    return response;
  } catch (err) {
    console.log(err);
  }
});
app.get('/allSubmissions', async (req, res) => {
  const response = await pool.query('SELECT * FROM Submissions');
  console.log(response);
  res.send(response);
  return response;
});

// the queries that we will need to use

/*

get participant info
  select * from Participants where participant_number = participant_number;


BELOW 3 Queries can be combined into 1 query for admin to retrieve all info of a session!! or a group of sessions!!!
get break info
  select * from Breaks where session_id = session_id;

get submission info
  select * from Submissions where session_id = session_id;

get logging info
  select count(id) from Sessions where participant_number = participant_number;


create break into
  INSERT INTO Breaks (session_id, has_accepted, duration) VALUES (1, true, 4)

create submission info
  INSERT INTO Submissions (session_id, patient_id, interpretation, last_interaction, is_valid) VALUES (1, 'pid-1', 'within range', 6, true)

create logging info ()
  insert into Sessions (participant_number, duration) values (participant_number, duration);

create participant info (will have 2 functions, 1 for automatic creation and 1 for manual creation)
  insert into Participants (participant_number, full_name, task_duration, break_duration, break_count_interval, break_time_interval) values (participant_number, full_name, task_duration, break_duration, break_count_interval, break_time_interval);


update settings
  update participant set task_duration = xxx, break_duration = xxx, break_count_interval = xxx, break_time_interval = xxx where participant_number = participant_number;

*/

// async function createDatabase() {
//   return await pool.query('CREATE DATABASE Database').then(([rows, fields]) => {
//     console.log(rows);
//   });
// }

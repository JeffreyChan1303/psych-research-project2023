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

export const showTables = async () => {
  const response = await pool.query('show tables;');
  console.log(response);
  return response;
};

// function for when participant logs in, to get the settings
export const findParticipantById = async (id: string) => {
  const response = await pool.query(
    'SELECT * FROM Participants WHERE participant_number = ?;',
    [id]
  );
  console.log(response);
  return response;
};

export const findAllSubmissions = async () => {
  const response = await pool.query('SELECT * FROM Submissions');
  console.log(response);
  return response;
};

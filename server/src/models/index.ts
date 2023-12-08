import mysql, { RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';
export {
  findBreakById,
  findAllBreaksByParticipantNumber,
  insertBreak,
} from './breaksModel';
export {
  findParticipantById,
  findParticipantByParticipantNumber,
  insertParticipant,
  updateParticipantSettings,
} from './participantsModel';
export {
  findSessionById,
  findSessionsByParticipantNumber,
  insertSession,
} from './sessionsModel';
export {
  findSubmissionById,
  findAllSubmissions,
  findAllSubmissionsByParticipantNumber,
  insertSubmission,
} from './submissionsModel';

dotenv.config();

export const pool = mysql
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

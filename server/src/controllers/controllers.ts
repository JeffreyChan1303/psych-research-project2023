import * as database from '../database/mysql.database';
import type { Request, Response } from 'express';

export const getTables = async (req: Request, res: Response) => {
  try {
    const response = await database.showTables();
    res.send(response);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const getParticipantById = async (req: Request, res: Response) => {
  try {
    // will need to fix this typing and learn how to do it
    const response = await database.findParticipantById(req.query.id as string);

    res.send(response);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const getAllSubmissions = async (req: Request, res: Response) => {
  try {
    const response = await database.findAllSubmissions();
    res.send(response);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const createBreak = async (req: Request, res: Response) => {
  try {
    const response = await database.insertBreak(
      req.body.session_id,
      req.body.has_accepted,
      req.body.duration
    );
    res.send(response);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const response = await database.insertSubmission(
      req.body.session_id,
      req.body.patient_id,
      req.body.interpretation,
      req.body.last_interaction,
      req.body.is_valid
    );
    res.send(response);
    return response;
  } catch (err) {
    console.log(err);
  }
};
export const createSession = async (req: Request, res: Response) => {
  try {
    const response = await database.insertSession(
      req.body.participant_number,
      req.body.duration
    );
    res.send(response);
    return response;
  } catch (err) {
    console.log(err);
  }
};
export const createParticipant = async (req: Request, res: Response) => {
  try {
    const response = await database.insertParticipant(
      req.body.participant_number,
      req.body.full_name,
      req.body.task_duration,
      req.body.break_duration,
      req.body.break_count_interval,
      req.body.break_time_interval
    );
    res.send(response);
    return response;
  } catch (err) {
    console.log(err);
  }
};
export const updateParticipantSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const response = await database.updateParticipantSettings(
      req.body.task_duration,
      req.body.break_duration,
      req.body.break_count_interval,
      req.body.break_time_interval,
      req.body.participant_number
    );
    res.send(response);
    return response;
  } catch (err) {
    console.log(err);
  }
};

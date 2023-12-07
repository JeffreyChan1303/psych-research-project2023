import * as database from '../database/mysql.database';
import type { Request, Response } from 'express';

export const getTables = async (req: Request, res: Response) => {
  try {
    const data = await database.showTables();
    res.send(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getParticipantById = async (req: Request, res: Response) => {
  try {
    // will need to fix this typing and learn how to do it
    const data = await database.findParticipantById(req.params.id as string);
    res.send(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getAllSubmissions = async (req: Request, res: Response) => {
  try {
    const data = await database.findAllSubmissions();
    res.send(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const createBreak = async (req: Request, res: Response) => {
  try {
    // will need to fix this type
    const data: any = await database.insertBreak(
      req.body.session_id,
      req.body.has_accepted,
      req.body.duration
    );
    res.send(data);

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const data = await database.insertSubmission(
      req.body.session_id,
      req.body.patient_id,
      req.body.interpretation,
      req.body.last_interaction,
      req.body.is_valid
    );
    res.send(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};
export const createSession = async (req: Request, res: Response) => {
  try {
    const { participant_number, duration } = req.body;
    const data = await database.insertSession(participant_number, duration);
    res.send(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};
export const createParticipant = async (req: Request, res: Response) => {
  try {
    // have a query that checks to see if the participant has already been created!
    const data = await database.insertParticipant(
      req.body.participant_number,
      req.body.full_name,
      req.body.task_duration,
      req.body.break_duration,
      req.body.break_count_interval,
      req.body.break_time_interval
    );
    res.send(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};
export const updateParticipantSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await database.updateParticipantSettings(
      req.body.task_duration,
      req.body.break_duration,
      req.body.break_count_interval,
      req.body.break_time_interval,
      req.body.participant_number
    );
    res.send(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

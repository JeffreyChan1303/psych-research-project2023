import * as database from '../database/mysql.database';
import type { Request, Response } from 'express';

export const getTables = async (req: Request, res: Response) => {
  try {
    const data = await database.showTables();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
};

export const getParticipantByParticipantNumber = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await database.findParticipantByParticipantNumber(
      req.params.participant_number
    );
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
};

export const getAllSubmissions = async (req: Request, res: Response) => {
  try {
    const data = await database.findAllSubmissions();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
};

export const createBreak = async (req: Request, res: Response) => {
  try {
    const data = await database.insertBreak(
      req.body.session_id,
      req.body.has_accepted,
      req.body.duration
    );

    const createdBreak = await database.findBreakById(
      data[0].insertId.toString()
    );
    res.status(201).json(createdBreak);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) res.status(404).json({ message: err.message });
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
    const createdSubmission = await database.findSubmissionById(
      data[0].insertId.toString()
    );
    res.status(201).json(createdSubmission);
  } catch (err) {
    console.log(err);
  }
};
export const createSession = async (req: Request, res: Response) => {
  try {
    const { participant_number, duration } = req.body;
    const data = await database.insertSession(participant_number, duration);
    const createdSession = await database.findSessionById(
      data[0].insertId.toString()
    );
    res.status(201).json(createdSession);
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
    const createdParticipant = await database.findParticipantById(
      data[0].insertId.toString()
    );
    res.status(201).json(createdParticipant);
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
    const updatedParticipant =
      await database.findParticipantByParticipantNumber(
        req.body.participant_number
      );
    res.status(201).json(updatedParticipant);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) res.status(404).json({ message: err.message });
  }
};

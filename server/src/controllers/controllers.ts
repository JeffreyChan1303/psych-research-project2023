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

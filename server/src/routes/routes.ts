import * as controllers from '../controllers/controllers';
import express from 'express';

const router = express.Router();

router.get('/', controllers.getTables);
router.get('/allSubmissions', controllers.getAllSubmissions);

// this is the entry function for the app, function to get initialization data
router.get(
  '/participantByParticipantNumber/:participant_number',
  controllers.getParticipantByParticipantNumber
);

// these 2 routes are for the csv file
router.get(
  '/allSubmissionsByParticipantNumber/:participant_number',
  controllers.getAllSubmissionsByParticipantNumber
);
router.get(
  '/allBreaksByParticipantNumber/:participant_number',
  controllers.getAllBreaksByParticipantNumber
);

// routes for data creation
router.post('/createBreak', controllers.createBreak);
router.post('/createSubmission', controllers.createSubmission);
router.post('/createSession', controllers.createSession);
router.post('/createParticipant', controllers.createParticipant);

// route to update participant settings
router.put('/updateParticipantSettings', controllers.updateParticipantSettings);

export default router;

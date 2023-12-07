import * as controllers from '../controllers/controllers';
import express from 'express';

const router = express.Router();

router.get('/', controllers.getTables);
router.get('/participantById/:id', controllers.getParticipantById);
router.get('/allSubmissions', controllers.getAllSubmissions);

router.post('/createBreak', controllers.createBreak);
router.post('/createSubmission', controllers.createSubmission);
router.post('/createSession', controllers.createSession);
router.post('/createParticipant', controllers.createParticipant);

router.put('/updateParticipantSettings', controllers.updateParticipantSettings);

export default router;

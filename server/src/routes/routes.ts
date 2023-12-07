import * as controllers from '../controllers/controllers';
import express from 'express';

const router = express.Router();

router.get('/', controllers.getTables);

router.get('/participantById/:id', controllers.getParticipantById);

router.get('/allSubmissions', controllers.getAllSubmissions);

export default router;

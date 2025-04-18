import express from 'express';
import { submitSleepEntry, getSleepEntries } from '../controllers/sleepcontroller.js';

const router = express.Router();

router.post('/entry', submitSleepEntry);

router.get('/:userId', getSleepEntries);

export default router;
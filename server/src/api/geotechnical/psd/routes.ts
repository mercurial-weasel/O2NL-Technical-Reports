import { Router } from 'express';
import { getPSDData, getPSDTestById, getPSDTestsByLocation } from './controller';

const router = Router();

// Specific routes first
router.get('/location/:locationId', getPSDTestsByLocation);
router.get('/:id', getPSDTestById);
// General route last
router.get('/', getPSDData);

export default router;

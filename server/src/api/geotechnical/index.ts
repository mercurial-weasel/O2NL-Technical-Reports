import { Router } from 'express';
import psdRoutes from './psd/routes';

/**
 * @swagger
 * tags:
 *   name: Geotechnical PSD
 *   description: Particle Size Distribution test endpoints
 */
const router = Router();

router.use('/psd', psdRoutes);

// Add other geotechnical routes here as needed

export default router;

import { Router } from 'express';
import geotechnicalRoutes from './geotechnical';

const router = Router();

router.use('/geotechnical', geotechnicalRoutes);

// Add other API domain routes here as needed

export default router;

import { Request, Response } from 'express';
import { psdService } from '../../../services/psdService';

/**
 * @swagger
 * /geotechnical/psd:
 *   get:
 *     summary: Get all particle size distribution tests
 *     tags: [Geotechnical PSD]
 *     responses:
 *       200:
 *         description: A list of PSD tests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PSDTest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const getPSDData = async (req: Request, res: Response) => {
  try {
    const data = await psdService.getAllPSDTests();
    
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getPSDData controller:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch PSD data'
    });
  }
};

/**
 * @swagger
 * /geotechnical/psd/{id}:
 *   get:
 *     summary: Get a specific PSD test by ID
 *     tags: [Geotechnical PSD]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the PSD test
 *     responses:
 *       200:
 *         description: The PSD test data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/PSDTest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const getPSDTestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const test = await psdService.getPSDTestById(id);
    
    if (!test) {
      return res.status(404).json({ 
        success: false,
        error: `PSD test with id ${id} not found` 
      });
    }
    
    return res.status(200).json({
      success: true,
      data: test
    });
  } catch (error) {
    console.error(`Error in getPSDTestById controller for id ${req.params.id}:`, error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch PSD test'
    });
  }
};

/**
 * @swagger
 * /geotechnical/psd/location/{locationId}:
 *   get:
 *     summary: Get PSD tests by location ID
 *     tags: [Geotechnical PSD]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Location identifier
 *     responses:
 *       200:
 *         description: A list of PSD tests for the specified location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PSDTest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const getPSDTestsByLocation = async (req: Request, res: Response) => {
  try {
    const { locationId } = req.params;
    const tests = await psdService.getPSDTestsByLocation(locationId);
    
    return res.status(200).json({
      success: true,
      data: tests
    });
  } catch (error) {
    console.error(`Error in getPSDTestsByLocation controller for locationId ${req.params.locationId}:`, error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch PSD tests by location'
    });
  }
};

import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

/**
 * Validates database connection
 */
async function validateConnection(): Promise<boolean> {
  try {
    // Try a simple query to check connection
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

/**
 * Service for handling Particle Size Distribution data
 */
export class PSDService {
  /**
   * Get all PSD tests
   */
  async getAllPSDTests() {
    try {
      // First validate connection
      const isConnected = await validateConnection();
      if (!isConnected) {
        throw new Error('Database connection failed - could not establish connection');
      }

      console.log('Fetching all PSD tests from database');
      
      // Use direct query instead of transaction since we're having model issues
      const psdTests = await prisma.particleSizeDistributionTest.findMany({
        include: {
          particle_size_result: true
        }
      });

      console.log(`Successfully fetched ${psdTests.length} PSD tests`);
      return psdTests.map(test => this.formatPSDTest(test));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (error.code === 'P2002') {
          console.error('Unique constraint failed:', error);
          throw new Error(`Database constraint error: ${error.message}`);
        } else if (error.code === 'P2025') {
          console.error('Record not found:', error);
          throw new Error(`Record not found: ${error.message}`);
        } else if (error.code.startsWith('P1')) {
          // P1xxx errors are related to connection issues
          console.error('Database connection error:', error);
          throw new Error(`Database connection error: ${error.message}`);
        }
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        console.error('Validation error:', error);
        throw new Error(`Database validation error: ${error.message}`);
      } else if (error instanceof Prisma.PrismaClientInitializationError) {
        console.error('Initialization error:', error);
        throw new Error(`Database initialization error: ${error.message}`);
      } else {
        console.error('Error fetching PSD tests from database:', error);
        throw new Error(`Failed to fetch PSD tests: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Re-throw to propagate the error
      throw error;
    }
  }

  /**
   * Get PSD test by ID
   */
  async getPSDTestById(id: string) {
    try {
      // First validate connection
      const isConnected = await validateConnection();
      if (!isConnected) {
        throw new Error('Database connection failed - could not establish connection');
      }

      console.log(`Fetching PSD test with ID ${id}`);
      
      // Use the correct model name
      const psdTest = await prisma.particleSizeDistributionTest.findUnique({
        where: { sample_unique_id: id },
        include: {
          particle_size_result: true
        }
      });
      
      if (!psdTest) {
        console.log(`No PSD test found with ID ${id}`);
        return null;
      }

      console.log(`Successfully fetched PSD test with ID ${id}`);
      return this.formatPSDTest(psdTest);
    } catch (error) {
      // Similar error handling with specific messages for this endpoint
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code.startsWith('P1')) {
          console.error(`Database connection error when fetching PSD test ${id}:`, error);
          throw new Error(`Database connection error: ${error.message}`);
        }
      }
      
      console.error(`Error fetching PSD test with ID ${id} from database:`, error);
      throw new Error(`Failed to fetch PSD test with ID ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get PSD tests by location ID
   */
  async getPSDTestsByLocation(locationId: string) {
    try {
      // First validate connection
      const isConnected = await validateConnection();
      if (!isConnected) {
        throw new Error('Database connection failed - could not establish connection');
      }

      console.log(`Fetching PSD tests for location ${locationId}`);
      
      // Use the correct model name
      const psdTests = await prisma.particleSizeDistributionTest.findMany({
        where: { location_id: locationId },
        include: {
          particle_size_result: true
        }
      });

      console.log(`Successfully fetched ${psdTests.length} PSD tests for location ${locationId}`);
      return psdTests.map(test => this.formatPSDTest(test));
    } catch (error) {
      // Similar error handling with specific messages for this endpoint
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code.startsWith('P1')) {
          console.error(`Database connection error when fetching PSD tests for location ${locationId}:`, error);
          throw new Error(`Database connection error: ${error.message}`);
        }
      }
      
      console.error(`Error fetching PSD tests for location ${locationId} from database:`, error);
      throw new Error(`Failed to fetch PSD tests for location ${locationId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Format PSD test data to match the expected API response format
   * This ensures compatibility with the frontend even if the database schema doesn't exactly match
   */
  private formatPSDTest(dbTest: any) {
    try {
      return {
        sample_unique_id: dbTest.sample_unique_id,
        sample_reference: dbTest.sample_reference,
        adit_id: dbTest.adit_id,
        location_id: dbTest.location_id,
        depth_to: dbTest.depth_to,
        average_water_content: dbTest.average_water_content ?? 0,
        sample_type: dbTest.sample_type,
        construction_subzone: dbTest.construction_subzone ?? '',
        date_tested: dbTest.date_tested ?? '',
        date_sampled: dbTest.date_sampled ?? '',
        date_checked: dbTest.date_checked ?? '',
        date_approved: dbTest.date_approved ?? '',
        test_no: dbTest.test_no ?? '',
        x_coordinate: dbTest.x_coordinate,
        y_coordinate: dbTest.y_coordinate,
        chainage: dbTest.chainage ?? '',
        distance_to_alignment: dbTest.distance_to_alignment ?? 0,
        angle_to_alignment_deg_cc: dbTest.angle_to_alignment_deg_cc ?? 0,
        remark_dot_test_remarks: dbTest.remark_dot_test_remarks ?? '',
        // Update to match the field name in the schema
        particle_size_result: dbTest.particle_size_result ? dbTest.particle_size_result.map((result: any) => ({
          sieve_size_mm: result.sieve_size_mm,
          percent_passing: result.percent_passing
        })) : []
      };
    } catch (error) {
      console.error('Error formatting PSD test data:', error);
      // Return as much data as we can, with safe defaults for missing fields
      return {
        ...dbTest,
        particle_size_result: Array.isArray(dbTest.particleSizeResults) 
          ? dbTest.particleSizeResults.map((r: any) => ({ 
              sieve_size_mm: r.sieve_size_mm || 0, 
              percent_passing: r.percent_passing || 0 
            }))
          : []
      };
    }
  }

  /**
   * Helper method to check database health
   * This can be exposed via an admin endpoint if needed
   */
  async checkDatabaseHealth() {
    try {
      const start = Date.now();
      const isConnected = await validateConnection();
      const duration = Date.now() - start;
      
      return {
        connected: isConnected,
        responseTimeMs: duration,
        databaseUrl: process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || 'Not configured'
      };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        databaseUrl: process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || 'Not configured'
      };
    }
  }
}

// Export a singleton instance
export const psdService = new PSDService();

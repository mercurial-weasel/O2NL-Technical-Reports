import { StaffMember } from './types';
import { API_CONFIG } from '../../data/config/api';
import { logger } from '../../lib/logger';
import { mockStaffData } from './mock-data';

export async function getStaffData(): Promise<StaffMember[]> {
  try {
    if (API_CONFIG.useMockData) {
      logger.info('Using mock staff data');
      return mockStaffData;
    }

    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.staff}`;
    logger.info('Making server-side API request to O2NL Backend', { url });

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      logger.error('Server-side API request failed', { status: response.status, error });
      throw new Error(error.error || 'Failed to fetch staff data');
    }

    const data = await response.json();
    logger.info('Server-side staff data fetched successfully', {
      recordCount: data.records?.length
    });

    // Transform API response to StaffMember format
    return data.records.map(record => ({
      firstName: record.fields.firstName,
      lastName: record.fields.lastName,
      email: record.fields.email,
      home: record.fields.home,
      organization: record.fields.organization,
      discipline: record.fields.discipline,
      subdiscipline: record.fields['sub discipline'],
      startDate: record.fields.startDate,
      endDate: record.fields.endDate,
      status: record.fields.status
    }));
  } catch (error) {
    logger.error('Error fetching staff data:', error);
    throw error;
  }
}
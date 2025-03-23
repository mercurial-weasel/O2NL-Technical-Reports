import { StaffData, StaffMember } from './types';
import { supabase } from '../../../base/supabase';

/**
 * Fetch all staff members
 */
export async function getStaffMembers(): Promise<StaffData> {
  try {
    console.log('Fetching staff data with Supabase');
    
    const { data, error } = await supabase
      .from('O2NL_Staff')
      .select('*');
    
    if (error) {
      console.error('Error fetching staff data from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    console.log(`Fetched ${data.length} staff members from Supabase`);
    
    // Parse the JSON data for monthlyFTE if it's stored as a string
    const parsedData = data.map(staff => ({
      ...staff,
      monthlyFTE: typeof staff.monthlyFTE === 'string' 
        ? JSON.parse(staff.monthlyFTE) 
        : staff.monthlyFTE
    }));
    
    return parsedData;
  } catch (error) {
    console.error('Error fetching staff data:', error);
    throw error;
  }
}

/**
 * Fetch a specific staff member by ID
 */
export async function getStaffMemberById(id: string): Promise<StaffMember | null> {
  try {
    const { data, error } = await supabase
      .from('O2NL_Staff')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - record not found
        console.warn(`Staff member with ID ${id} not found`);
        return null;
      }
      console.error(`Error fetching staff member with ID ${id} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    // Parse the JSON data for monthlyFTE if it's stored as a string
    return {
      ...data,
      monthlyFTE: typeof data.monthlyFTE === 'string' 
        ? JSON.parse(data.monthlyFTE) 
        : data.monthlyFTE
    };
  } catch (error) {
    console.error(`Error fetching staff member with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch staff members by team
 */
export async function getStaffMembersByTeam(team: string): Promise<StaffData> {
  try {
    const { data, error } = await supabase
      .from('O2NL_Staff')
      .select('*')
      .eq('team', team);
    
    if (error) {
      console.error(`Error fetching staff members for team ${team} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    // Parse the JSON data for monthlyFTE if it's stored as a string
    return data.map(staff => ({
      ...staff,
      monthlyFTE: typeof staff.monthlyFTE === 'string' 
        ? JSON.parse(staff.monthlyFTE) 
        : staff.monthlyFTE
    }));
  } catch (error) {
    console.error(`Error fetching staff members for team ${team}:`, error);
    throw error;
  }
}

/**
 * Fetch staff members by discipline manager
 */
export async function getStaffMembersByManager(manager: string): Promise<StaffData> {
  try {
    const { data, error } = await supabase
      .from('O2NL_Staff')
      .select('*')
      .eq('disciplineManager', manager);
    
    if (error) {
      console.error(`Error fetching staff members for manager ${manager} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data.map(staff => ({
      ...staff,
      monthlyFTE: typeof staff.monthlyFTE === 'string' 
        ? JSON.parse(staff.monthlyFTE) 
        : staff.monthlyFTE
    }));
  } catch (error) {
    console.error(`Error fetching staff members for manager ${manager}:`, error);
    throw error;
  }
}

/**
 * Get unique teams from all staff members
 */
export async function getUniqueTeams(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('O2NL_Staff')
      .select('team');
    
    if (error) {
      console.error('Error fetching teams from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    const teams = new Set<string>();
    data.forEach(item => {
      if (item.team) {
        teams.add(item.team);
      }
    });
    
    return Array.from(teams).sort();
  } catch (error) {
    console.error('Error getting unique teams:', error);
    throw error;
  }
}

/**
 * Get unique discipline managers from all staff members
 */
export async function getUniqueDisciplineManagers(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('O2NL_Staff')
      .select('disciplineManager');
    
    if (error) {
      console.error('Error fetching discipline managers from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    const managers = new Set<string>();
    data.forEach(item => {
      if (item.disciplineManager) {
        managers.add(item.disciplineManager);
      }
    });
    
    return Array.from(managers).sort();
  } catch (error) {
    console.error('Error getting unique discipline managers:', error);
    throw error;
  }
}

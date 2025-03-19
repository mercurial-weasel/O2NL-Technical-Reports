import { PrismaClient } from '@prisma/client';

/**
 * Seed data for PSD tests
 */
const psdSeedData = [
  {
    id: '1',
    adit_id: 'A001',
    location_id: 'L001',
    depth_to: 2.5,
    sample_reference: 'SR001',
    sample_type: 'Disturbed',
    date_sampled: '2023-01-15',
    sample_unique_id: 'SU001',
    test_no: 1,
    date_tested: '2023-01-20',
    date_checked: '2023-01-21',
    date_approved: '2023-01-22',
    remark_dot_test_remarks: 'No issues noted',
    average_water_content: '12.5%',
    superseeding_note: null,
    chainage: 1050.5,
    distance_to_alignment: 3.2,
    angle_to_alignment_deg_cc: 45.0,
    construction_subzone: 'Zone A',
    x_coordinate: 1789654.32,
    y_coordinate: 5446789.15,
    particle_size_result: [
      { sieve_size_mm: 63.0, percent_passing: 100.0 },
      { sieve_size_mm: 37.5, percent_passing: 95.8 },
      { sieve_size_mm: 19.0, percent_passing: 87.2 },
      { sieve_size_mm: 9.5, percent_passing: 75.1 },
      { sieve_size_mm: 4.75, percent_passing: 60.3 },
      { sieve_size_mm: 2.36, percent_passing: 48.7 },
      { sieve_size_mm: 1.18, percent_passing: 35.2 },
      { sieve_size_mm: 0.600, percent_passing: 25.8 },
      { sieve_size_mm: 0.300, percent_passing: 18.4 },
      { sieve_size_mm: 0.150, percent_passing: 12.1 },
      { sieve_size_mm: 0.075, percent_passing: 8.5 },
    ]
  },
  {
    id: '2',
    adit_id: 'A001',
    location_id: 'L002',
    depth_to: 5.0,
    sample_reference: 'SR002',
    sample_type: 'Undisturbed',
    date_sampled: '2023-01-15',
    sample_unique_id: 'SU002',
    test_no: 2,
    date_tested: '2023-01-20',
    date_checked: '2023-01-21',
    date_approved: '2023-01-22',
    remark_dot_test_remarks: 'Clay content noted',
    average_water_content: '18.3%',
    superseeding_note: 'Replaces previous test on same location',
    chainage: 1100.5,
    distance_to_alignment: 2.8,
    angle_to_alignment_deg_cc: 32.0,
    construction_subzone: 'Zone A',
    x_coordinate: 1789700.54,
    y_coordinate: 5446820.78,
    particle_size_result: [
      { sieve_size_mm: 63.0, percent_passing: 100.0 },
      { sieve_size_mm: 37.5, percent_passing: 100.0 },
      { sieve_size_mm: 19.0, percent_passing: 98.5 },
      { sieve_size_mm: 9.5, percent_passing: 92.3 },
      { sieve_size_mm: 4.75, percent_passing: 83.7 },
      { sieve_size_mm: 2.36, percent_passing: 72.5 },
      { sieve_size_mm: 1.18, percent_passing: 58.9 },
      { sieve_size_mm: 0.600, percent_passing: 45.2 },
      { sieve_size_mm: 0.300, percent_passing: 32.7 },
      { sieve_size_mm: 0.150, percent_passing: 25.4 },
      { sieve_size_mm: 0.075, percent_passing: 20.8 },
    ]
  },
  {
    id: '3',
    adit_id: 'A002',
    location_id: 'L003',
    depth_to: 8.5,
    sample_reference: 'SR003',
    sample_type: 'Disturbed',
    date_sampled: '2023-02-10',
    sample_unique_id: 'SU003',
    test_no: 3,
    date_tested: '2023-02-15',
    date_checked: '2023-02-16',
    date_approved: '2023-02-17',
    remark_dot_test_remarks: 'Gravelly sample',
    average_water_content: '8.2%',
    superseeding_note: null,
    chainage: 1250.0,
    distance_to_alignment: 5.5,
    angle_to_alignment_deg_cc: 15.0,
    construction_subzone: 'Zone B',
    x_coordinate: 1790050.21,
    y_coordinate: 5447150.89,
    particle_size_result: [
      { sieve_size_mm: 63.0, percent_passing: 100.0 },
      { sieve_size_mm: 37.5, percent_passing: 89.5 },
      { sieve_size_mm: 19.0, percent_passing: 68.2 },
      { sieve_size_mm: 9.5, percent_passing: 42.8 },
      { sieve_size_mm: 4.75, percent_passing: 28.5 },
      { sieve_size_mm: 2.36, percent_passing: 21.4 },
      { sieve_size_mm: 1.18, percent_passing: 18.7 },
      { sieve_size_mm: 0.600, percent_passing: 15.2 },
      { sieve_size_mm: 0.300, percent_passing: 11.4 },
      { sieve_size_mm: 0.150, percent_passing: 7.2 },
      { sieve_size_mm: 0.075, percent_passing: 4.5 },
    ]
  }
];

/**
 * Seed the database with PSD test data
 */
export async function seedPSDData(prisma) {
  console.log('Seeding PSD data...');
  
  // Check if data already exists to prevent duplicate entries
  const existingData = await prisma.pSDData.findFirst();
  if (existingData) {
    console.log('PSD data already exists, skipping seed.');
    return;
  }
  
  // Create container record
  const psdData = await prisma.pSDData.create({
    data: {
      lastUpdated: new Date()
    }
  });
  
  // Create test records with their sieve items
  for (const test of psdSeedData) {
    const { particle_size_result, ...testData } = test;
    
    try {
      await prisma.particleSizeDistributionTest.create({
        data: {
          ...testData,
          createdAt: new Date(),
          updatedAt: new Date(),
          particle_size_result: {
            create: particle_size_result
          }
        },
        include: {
          particle_size_result: true
        }
      });
      console.log(`Created PSD test: ${test.sample_unique_id}`);
    } catch (error) {
      console.error(`Error seeding test ${test.sample_unique_id}:`, error);
    }
  }
  
  console.log('PSD data seeded successfully!');
}
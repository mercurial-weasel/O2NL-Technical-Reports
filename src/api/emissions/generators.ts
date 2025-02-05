// generators.ts
import { CarbonEmissionRecord, EmissionSource, EmissionSubCategories } from './types';

export function generateMockEmissions(numRecords: number): CarbonEmissionRecord[] {
  const emissions: CarbonEmissionRecord[] = [];
  const sources = Object.keys(EmissionSubCategories) as EmissionSource[];

  for (let i = 0; i < numRecords; i++) {
    const month = Math.floor(Math.random() * 12); // Random month (0-11)
    const day = Math.floor(Math.random() * 28) + 1; // Random day (1-28)
    const date = new Date(2024, month, day);
    
    sources.forEach(source => {
      const subCategories = EmissionSubCategories[source];
      subCategories.forEach(subCategory => {
        const amount = Math.random() * 90 + 10;
        
        emissions.push({
          id: `emission-${i}-${source}-${subCategory}`.toLowerCase().replace(/\s+/g, '-'),
          projectId: "o2nl-paa",
          source: source,
          subCategory: subCategory,
          amount: Number(amount.toFixed(2)),
          unit: "tCO2e",
          date: date.toISOString(),
          latitude: -40.3523 + (Math.random() - 0.5) * 2,
          longitude: 175.6082 + (Math.random() - 0.5) * 2,
          emissionFactor: Number((Math.random() * 2 + 1).toFixed(2)),
          notes: `Monthly ${source} emissions from ${subCategory}`,
          createdAt: new Date().toISOString()
        });
      });
    });
  }
  
  return emissions;
}

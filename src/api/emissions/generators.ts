// generators.ts
import { CarbonEmissionRecord, EmissionSource, EmissionSubCategories } from './types';

export function generateMockEmissions(): CarbonEmissionRecord[] {
  const emissions: CarbonEmissionRecord[] = [];
  const sources = Object.keys(EmissionSubCategories) as EmissionSource[];

  for (let month = 0; month < 12; month++) {
    const date = new Date(2024, month, 15);
    
    sources.forEach(source => {
      const subCategories = EmissionSubCategories[source];
      subCategories.forEach(subCategory => {
        const amount = Math.random() * 90 + 10;
        
        emissions.push({
          id: `emission-${month}-${source}-${subCategory}`.toLowerCase().replace(/\s+/g, '-'),
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

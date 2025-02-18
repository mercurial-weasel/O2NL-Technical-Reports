import React, { useState, useEffect } from 'react';
import { Header } from '../../../common/Header';
import { Footer } from '../../../common/Footer';
import { Section } from '../../../common';
import { BackNavigation } from '../../../common/BackNavigation';
import { EquipmentCard } from './components/EquipmentCard';
import { EquipmentDetail } from './components/EquipmentDetail';
import { EquipmentApiClient } from '../../../../api/equipment/client';
import { EquipmentType } from '../../../../api/equipment/types';
import { calculateEquipmentSummaries } from '../../../../api/equipment/transformations';
import { logger } from '../../../../lib/logger';

export function EquipmentStatus() {
  const [selectedType, setSelectedType] = useState<EquipmentType | null>(null);
  const [equipmentData, setEquipmentData] = useState<EquipmentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new EquipmentApiClient();
        const data = await client.fetchEquipmentData();
        setEquipmentData(data.equipmentTypes);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load equipment data');
        logger.error('Equipment data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading equipment data...</div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <div className="text-red-400">
                Error loading equipment data: {error.message}
              </div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  const summaries = calculateEquipmentSummaries({ 
    lastUpdated: new Date().toISOString(),
    equipmentTypes: equipmentData 
  });

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary">Equipment Status</h1>
            <p className="text-text-secondary mt-2">
              Monitor and track the status of project equipment and machinery
            </p>
          </div>

          {selectedType ? (
            <EquipmentDetail
              equipmentType={selectedType}
              onClose={() => setSelectedType(null)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {summaries.map((summary) => (
                <EquipmentCard
                  key={summary.name}
                  summary={summary}
                  onClick={() => {
                    const type = equipmentData.find(t => t.name === summary.name);
                    if (type) setSelectedType(type);
                  }}
                />
              ))}
            </div>
          )}
        </Section>
      </div>
      <Footer />
    </div>
  );
}
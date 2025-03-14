import React, { useState, useEffect } from 'react';
import { Header, Footer, Section, Button, BackNavigation } from '@common';
import { EquipmentCard } from './components/EquipmentCard';
import { EquipmentDetail } from './components/EquipmentDetail';
import { EquipmentApiClient } from '@api/projectcontrols/other';
import { EquipmentType } from '@api/projectcontrols/other';
import { calculateEquipmentSummaries } from '@api/projectcontrols/other';
import { logger } from '@lib/logger';
import { Download } from 'lucide-react';

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

  const handleDownloadCSV = () => {
    try {
      // Define headers
      const headers = [
        'Equipment Type',
        'Equipment ID',
        'Serial Number',
        'Status',
        'Last Updated Date',
        'Last Updated Time',
        'Easting',
        'Northing',
        'Elevation',
        'Unit',
        'Measurement Type',
        'Key Metrics',
        'Alert Comments'
      ];

      // Create rows
      const rows = equipmentData.flatMap(type => 
        type.equipment.map(equipment => [
          type.name,
          equipment.equipmentId,
          equipment.serialNumber,
          equipment.status,
          equipment.lastUpdated.date,
          equipment.lastUpdated.time,
          equipment.easting.toString(),
          equipment.northing.toString(),
          equipment.elevation.toString(),
          equipment.unit,
          equipment.measurementType,
          equipment.keyMetrics,
          equipment.alert?.comments || ''
        ])
      );

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and trigger download
      const date = new Date().toISOString().slice(0, 10);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `equipment_status_${date}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      logger.info('Equipment status CSV download completed');
    } catch (error) {
      logger.error('Equipment status CSV download failed', { error });
      // You might want to show a user-friendly error message here
    }
  };

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
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-text-primary">Equipment Status</h1>
              {!selectedType && (
                <Button
                  onClick={handleDownloadCSV}
                  variant="secondary"
                  size="sm"
                  icon={Download}
                >
                  Download CSV
                </Button>
              )}
            </div>
            <p className="text-text-secondary">
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
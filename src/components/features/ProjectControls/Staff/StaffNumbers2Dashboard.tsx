import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@common/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@common/ui/Tabs';
import { StaffNumbers2Table } from './StaffNumbers2Table';
import { StaffNumbers2Chart } from './StaffNumbers2Chart';
import { 
  StaffMember, 
  calculateStaffNumbers,
  StaffSummary 
} from '@api/projectcontrols/peopleculture/staff';

interface StaffNumbersDashboardProps {
  data: StaffMember[];
}

export function StaffNumbersDashboard({ data }: StaffNumbersDashboardProps) {
  const [staffSummary, setStaffSummary] = useState<StaffSummary | null>(null);
  
  useEffect(() => {
    if (data && data.length > 0) {
      setStaffSummary(calculateStaffNumbers(data));
    }
  }, [data]);
  
  if (!staffSummary) {
    return <div>Loading staff numbers data...</div>;
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Staff Numbers</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="table">
          <TabsList className="mb-4">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <StaffNumbers2Table data={staffSummary} />
          </TabsContent>
          <TabsContent value="chart">
            <StaffNumbers2Chart data={staffSummary} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@common/Header/Header';
import { Footer } from '@common/Footer/Footer';
import { Section } from '@common/Section/Section';
import { Card } from '@common/Card/Card';
import { Button } from '@common/Button/Button';
import { BackNavigation } from '@common/BackNavigation/BackNavigation';
import { BudgetVisualization } from './BudgetVisualization';
import { BudgetMetrics } from './components/BudgetMetrics';
import { ViewToggle } from './components/ViewToggle';
import { BudgetTable } from './components/BudgetTable';
import { MonthSelector } from './components/MonthSelector';
import { AMTBudgetApiClient } from '@api/cost/amt-budgets/client';
import { calculateBudgetMetrics, getAvailableMonths, getMonthlyData } from '@api/cost/amt-budgets/transformations';
import { logger } from '@lib/logger';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type ViewMode = 'table' | 'hours' | 'budget';

// Currency formatter helper
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export function BudgetTracking() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('hours');
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new AMTBudgetApiClient();
        const data = await client.fetchAMTBudgetData();
        setBudgetData(data);
        
        // Set initial selected period to latest month
        const months = getAvailableMonths(data);
        if (months.length > 0) {
          setSelectedPeriod(months[0]);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load budget data');
        logger.error('Budget data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const availableMonths = React.useMemo(() => 
    budgetData ? getAvailableMonths(budgetData) : [],
  [budgetData]);

  const currentMonthData = React.useMemo(() => 
    budgetData && selectedPeriod ? getMonthlyData(budgetData, selectedPeriod) : null,
  [budgetData, selectedPeriod]);

  const metrics = React.useMemo(() => 
    currentMonthData ? calculateBudgetMetrics(currentMonthData) : [],
  [currentMonthData]);

  const handleSort = (field: string) => {
    setSortConfig(current => ({
      field,
      direction: current?.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDownloadPDF = async () => {
    try {
      if (!contentRef.current) return;

      logger.info('Starting PDF generation');

      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add title
      const title = `AMT Budget Tracking - ${new Date(selectedPeriod + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}`;
      pdf.setFontSize(16);
      pdf.text(title, pageWidth / 2, 15, { align: 'center' });

      // Capture the content as an image
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#161616' // Match background color
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');

      // Calculate dimensions to fit on page
      const imgWidth = pageWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 10, 25, imgWidth, imgHeight);

      // Save the PDF
      const date = new Date().toISOString().slice(0, 10);
      pdf.save(`amt_budget_tracking_${date}.pdf`);

      logger.info('PDF generation completed');
    } catch (error) {
      logger.error('PDF generation failed', { error });
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
              <div className="text-text-secondary">Loading budget data...</div>
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
                Error loading budget data: {error.message}
              </div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentMonthData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header with Period Selector */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">AMT Budget Tracking</h1>
            <div className="flex items-center gap-4">
              {/* Download Button */}
              <Button
                onClick={handleDownloadPDF}
                variant="secondary"
                size="sm"
                icon={Download}
              >
                Download PDF
              </Button>
              <MonthSelector
                selectedPeriod={selectedPeriod}
                availableMonths={availableMonths}
                onPeriodChange={setSelectedPeriod}
              />
            </div>
          </div>

          <div ref={contentRef}>
            {/* Metrics */}
            <BudgetMetrics 
              metrics={metrics}
              formatCurrency={formatCurrency}
            />

            {/* View Toggle */}
            <ViewToggle 
              viewMode={viewMode}
              onViewChange={setViewMode}
            />

            {/* Content */}
            <Card className="p-6" hover>
              {viewMode === 'table' ? (
                <BudgetTable
                  data={currentMonthData.AMTBudgetTrackingData}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                  formatCurrency={formatCurrency}
                />
              ) : (
                <BudgetVisualization 
                  data={currentMonthData.AMTBudgetTrackingData}
                  mode={viewMode}
                />
              )}
            </Card>
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
}
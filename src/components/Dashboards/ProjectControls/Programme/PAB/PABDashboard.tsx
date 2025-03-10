import React, { useState, useEffect, useRef } from 'react';
import { Header, Footer, Section, Button, BackNavigation } from '@common';
import { BudgetCard } from './BudgetCard';
import { CostCard } from './CostCard';
import { CostIndicatorsCard } from './CostIndicatorsCard';
import { RiskIndicatorsCard } from './RiskIndicatorsCard';
import { Limb1IndicatorsCard } from './Limb1IndicatorsCard';
import { Limb3IndicatorsCard } from './Limb3IndicatorsCard';
import { ExpenditureIndicatorsCard } from './ExpenditureIndicatorsCard';
import { ExpenditureChart } from './ExpenditureChart';
import { FundingSplitCard } from './FundingSplitCard';
import { PABApiClient } from '@api/cost/pab/client';
import { PABResponse } from '@api/cost/pab/types';
import { logger } from '@lib/logger';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function PABDashboard() {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [pabData, setPabData] = useState<PABResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new PABApiClient();
        const data = await client.fetchPABData(selectedMonth);
        setPabData(data);
        setAvailableMonths(data.availableMonths);
        
        // Set initial selected month if not already set
        if (!selectedMonth && data.availableMonths.length > 0) {
          setSelectedMonth(data.availableMonths[0]);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load PAB data');
        logger.error('PAB data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const handleDownloadPDF = async () => {
    try {
      if (!contentRef.current) return;

      logger.info('Starting PDF generation');

      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add title
      const title = `Project Advisory Board Report - ${new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}`;
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
      pdf.save(`pab_report_${date}.pdf`);

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
              <div className="text-text-secondary">Loading PAB data...</div>
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
                Error loading PAB data: {error.message}
              </div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pabData) return null;

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/project-controls" text="Back to Project Controls" />
          
          {/* Header with Month Selector */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">Project Advisory Board</h1>
            
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

              {/* Month Selector */}
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm text-text-primary hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary min-w-[160px]"
                >
                  {availableMonths.map(month => (
                    <option key={month} value={month}>
                      {new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div ref={contentRef} className="grid grid-cols-2 gap-x-6">
            {/* Left Column */}
            <div className="space-y-0">
              <BudgetCard data={pabData.currentMonth.budget} />
              <CostIndicatorsCard data={pabData.currentMonth.costIndicators} />
              <CostCard data={pabData.currentMonth.cost} />
              <Limb1IndicatorsCard data={pabData.currentMonth.limb1Indicators} />
            </div>

            {/* Right Column */}
            <div className="space-y-0">
              <ExpenditureChart data={pabData.currentMonth.expenditure} />
              <RiskIndicatorsCard data={pabData.currentMonth.riskIndicators} />
              <FundingSplitCard data={pabData.currentMonth.fundingSplit} />
              <Limb3IndicatorsCard data={pabData.currentMonth.limb3Indicators} />
            </div>
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
}
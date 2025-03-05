import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangeSelector } from '../../../../components/Dashboards/Environmental/sensors/common/DateRangeSelector';
import { DeviceSelector } from '../../../../components/Dashboards/Environmental/sensors/common/DeviceSelector';
import { ViewModeToggle } from '../../../../components/Dashboards/Environmental/sensors/common/ViewModeToggle';
import { ParameterSelector } from '../../../../components/Dashboards/Environmental/sensors/common/ParameterSelector';
import { StatusLegend } from '../../../../components/Dashboards/Environmental/sensors/common/StatusLegend';
import { ChartContainer } from '../../../../components/Dashboards/Environmental/sensors/common/ChartContainer';
import { DataTable } from '../../../../components/Dashboards/Environmental/sensors/common/DataTable';
import { MetricSelector } from '../../../../components/Dashboards/Environmental/sensors/common/MetricSelector';
import { SensorHeader } from '../../../../components/Dashboards/Environmental/sensors/common/SensorHeader';
import { SensorLayout } from '../../../../components/Dashboards/Environmental/sensors/common/SensorLayout';
import { LoadingState } from '../../../../components/Dashboards/Environmental/sensors/common/LoadingState';
import { ErrorState } from '../../../../components/Dashboards/Environmental/sensors/common/ErrorState';
import { ComplianceIndicator } from '../../../../components/Dashboards/Environmental/sensors/common/ComplianceIndicator';
import { DeviceStatusBadge } from '../../../../components/Dashboards/Environmental/sensors/common/DeviceStatusBadge';
import { MetricCard } from '../../../../components/Dashboards/Environmental/sensors/common/MetricCard';
import { SensorMetrics } from '../../../../components/Dashboards/Environmental/sensors/common/SensorMetrics';
import { SensorStats } from '../../../../components/Dashboards/Environmental/sensors/common/SensorStats';
import { SensorFilters } from '../../../../components/Dashboards/Environmental/sensors/common/SensorFilters';
import { SensorThresholds } from '../../../../components/Dashboards/Environmental/sensors/common/SensorThresholds';
import { SensorAlerts } from '../../../../components/Dashboards/Environmental/sensors/common/SensorAlerts';
import { SensorExport } from '../../../../components/Dashboards/Environmental/sensors/common/SensorExport';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>
}));

describe('Environmental Sensors Common Components', () => {
  describe('DateRangeSelector', () => {
    it('renders date inputs', () => {
      render(
        <DateRangeSelector
          dateRange={[null, null]}
          onChange={() => {}}
        />
      );
      expect(screen.getAllByRole('textbox')).toHaveLength(2);
    });
  });

  describe('DeviceSelector', () => {
    const devices = [
      { id: 'device1', name: 'Device 1', model: 'Model A' },
      { id: 'device2', name: 'Device 2', model: 'Model B' }
    ];

    it('renders device options', () => {
      render(
        <DeviceSelector
          devices={devices}
          selectedDevices={new Set(['all'])}
          onChange={() => {}}
        />
      );
      expect(screen.getByText('Select Devices')).toBeInTheDocument();
    });
  });

  describe('ViewModeToggle', () => {
    it('renders view mode options', () => {
      render(
        <ViewModeToggle
          mode="chart"
          onChange={() => {}}
        />
      );
      expect(screen.getByText('Chart')).toBeInTheDocument();
      expect(screen.getByText('Table')).toBeInTheDocument();
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });
  });

  describe('ParameterSelector', () => {
    it('renders parameter options', () => {
      render(
        <ParameterSelector
          selectedParameters={new Set(['pm10', 'pm2_5'])}
          onChange={() => {}}
        />
      );
      expect(screen.getByText('PM10')).toBeInTheDocument();
      expect(screen.getByText('PM2.5')).toBeInTheDocument();
    });
  });

  describe('StatusLegend', () => {
    const levels = [
      { range: '0-50', label: 'Good', color: '#10B981' },
      { range: '51-100', label: 'Moderate', color: '#F59E0B' }
    ];

    it('renders status levels', () => {
      render(<StatusLegend title="Air Quality" levels={levels} />);
      expect(screen.getByText('Air Quality')).toBeInTheDocument();
      levels.forEach(level => {
        expect(screen.getByText(level.label)).toBeInTheDocument();
      });
    });
  });

  describe('ChartContainer', () => {
    it('renders chart with title', () => {
      render(
        <ChartContainer
          data={[]}
          layout={{}}
          title="Test Chart"
        />
      );
      expect(screen.getByText('Test Chart')).toBeInTheDocument();
    });
  });

  describe('DataTable', () => {
    const columns = [
      { field: 'name', title: 'Name', align: 'left' },
      { field: 'value', title: 'Value', align: 'right' }
    ];

    it('renders table headers', () => {
      render(<DataTable columns={columns} data={[]} />);
      columns.forEach(column => {
        expect(screen.getByText(column.title)).toBeInTheDocument();
      });
    });
  });

  describe('SensorHeader', () => {
    it('renders header with title and description', () => {
      render(
        <SensorHeader
          title="Sensor Dashboard"
          description="Test description"
        />
      );
      expect(screen.getByText('Sensor Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });
  });

  describe('LoadingState', () => {
    it('renders loading message', () => {
      render(<LoadingState backLink="/test" backText="Back" />);
      expect(screen.getByText('Loading sensor data...')).toBeInTheDocument();
    });
  });

  describe('ErrorState', () => {
    it('renders error message', () => {
      const error = new Error('Test error');
      render(<ErrorState error={error} backLink="/test" backText="Back" />);
      expect(screen.getByText(/Test error/)).toBeInTheDocument();
    });
  });

  describe('ComplianceIndicator', () => {
    it('renders status with correct color', () => {
      render(<ComplianceIndicator status="Compliant" />);
      const indicator = screen.getByText('Compliant');
      expect(indicator).toHaveClass('bg-green-500/20', 'text-green-400');
    });
  });

  describe('DeviceStatusBadge', () => {
    it('renders status badge with correct color', () => {
      render(<DeviceStatusBadge status="active" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('bg-green-500');
    });
  });

  describe('MetricCard', () => {
    it('renders metric with value and unit', () => {
      render(
        <MetricCard
          title="Test Metric"
          value={25.5}
          unit="°C"
        />
      );
      expect(screen.getByText('Test Metric')).toBeInTheDocument();
      expect(screen.getByText('25.5°C')).toBeInTheDocument();
    });
  });

  describe('SensorMetrics', () => {
    const metrics = [
      { title: 'Metric 1', value: 25.5, unit: '°C' },
      { title: 'Metric 2', value: 50, unit: '%' }
    ];

    it('renders multiple metrics', () => {
      render(<SensorMetrics metrics={metrics} />);
      metrics.forEach(metric => {
        expect(screen.getByText(metric.title)).toBeInTheDocument();
      });
    });
  });

  describe('SensorStats', () => {
    const stats = [
      { label: 'Stat 1', value: 100, unit: 'units' },
      { label: 'Stat 2', value: 200, unit: 'units' }
    ];

    it('renders stats with labels and values', () => {
      render(<SensorStats title="Test Stats" stats={stats} />);
      stats.forEach(stat => {
        expect(screen.getByText(stat.label)).toBeInTheDocument();
      });
    });
  });

  describe('SensorThresholds', () => {
    const thresholds = [
      { label: 'Low', value: 50, unit: 'units', color: '#10B981' },
      { label: 'High', value: 100, unit: 'units', color: '#EF4444' }
    ];

    it('renders thresholds with labels and values', () => {
      render(<SensorThresholds title="Test Thresholds" thresholds={thresholds} />);
      thresholds.forEach(threshold => {
        expect(screen.getByText(threshold.label)).toBeInTheDocument();
      });
    });
  });

  describe('SensorAlerts', () => {
    const alerts = [
      {
        id: '1',
        type: 'warning',
        message: 'Test warning',
        timestamp: new Date().toISOString(),
        device: 'Device 1'
      }
    ];

    it('renders alerts with messages', () => {
      render(<SensorAlerts alerts={alerts} />);
      expect(screen.getByText('Test warning')).toBeInTheDocument();
    });
  });

  describe('SensorExport', () => {
    it('renders export button', () => {
      render(<SensorExport onExport={() => {}} />);
      expect(screen.getByText('Export Data')).toBeInTheDocument();
    });

    it('shows loading state', () => {
      render(<SensorExport onExport={() => {}} loading={true} />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });
});
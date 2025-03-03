import type { Meta, StoryObj } from '@storybook/react';
import { SensorAlerts } from './SensorAlerts';

const meta = {
  title: 'Dashboards/Common/SensorAlerts',
  component: SensorAlerts,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    alerts: {
      control: 'object',
      description: 'Array of alert objects'
    }
  },
} satisfies Meta<typeof SensorAlerts>;

export default meta;
type Story = StoryObj<typeof meta>;

const generateTimestamp = (minutesAgo: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

export const Default: Story = {
  args: {
    alerts: [
      {
        id: '1',
        type: 'warning',
        message: 'High PM10 levels detected',
        timestamp: generateTimestamp(5),
        device: 'Dust Monitor 1'
      },
      {
        id: '2',
        type: 'critical',
        message: 'Sensor malfunction',
        timestamp: generateTimestamp(10),
        device: 'Dust Monitor 2'
      },
      {
        id: '3',
        type: 'info',
        message: 'Calibration completed',
        timestamp: generateTimestamp(15),
        device: 'Dust Monitor 3'
      }
    ]
  }
};

export const WarningsOnly: Story = {
  args: {
    alerts: [
      {
        id: '1',
        type: 'warning',
        message: 'High PM10 levels detected',
        timestamp: generateTimestamp(5),
        device: 'Dust Monitor 1'
      },
      {
        id: '2',
        type: 'warning',
        message: 'Battery level low',
        timestamp: generateTimestamp(10),
        device: 'Dust Monitor 2'
      }
    ]
  }
};

export const CriticalAlerts: Story = {
  args: {
    alerts: [
      {
        id: '1',
        type: 'critical',
        message: 'Sensor malfunction',
        timestamp: generateTimestamp(5),
        device: 'Dust Monitor 1'
      },
      {
        id: '2',
        type: 'critical',
        message: 'Connection lost',
        timestamp: generateTimestamp(10),
        device: 'Dust Monitor 2'
      }
    ]
  }
};

export const InfoAlerts: Story = {
  args: {
    alerts: [
      {
        id: '1',
        type: 'info',
        message: 'Calibration completed',
        timestamp: generateTimestamp(5),
        device: 'Dust Monitor 1'
      },
      {
        id: '2',
        type: 'info',
        message: 'Maintenance scheduled',
        timestamp: generateTimestamp(10),
        device: 'Dust Monitor 2'
      }
    ]
  }
};

export const MixedAlerts: Story = {
  args: {
    alerts: [
      {
        id: '1',
        type: 'critical',
        message: 'Sensor malfunction',
        timestamp: generateTimestamp(5),
        device: 'Dust Monitor 1'
      },
      {
        id: '2',
        type: 'warning',
        message: 'High PM10 levels',
        timestamp: generateTimestamp(10),
        device: 'Dust Monitor 2'
      },
      {
        id: '3',
        type: 'info',
        message: 'Calibration completed',
        timestamp: generateTimestamp(15),
        device: 'Dust Monitor 3'
      }
    ]
  }
};

export const NoAlerts: Story = {
  args: {
    alerts: []
  }
};

export const ManyAlerts: Story = {
  args: {
    alerts: Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      type: ['warning', 'critical', 'info'][i % 3] as 'warning' | 'critical' | 'info',
      message: `Alert message ${i + 1}`,
      timestamp: generateTimestamp(i * 5),
      device: `Dust Monitor ${i + 1}`
    }))
  }
};
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
      } Continuing with the remaining stories:
    ]
  }
}
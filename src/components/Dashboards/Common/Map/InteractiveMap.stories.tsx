import type { Meta, StoryObj } from '@storybook/react';
import { InteractiveMap } from './InteractiveMap';
import 'leaflet/dist/leaflet.css';

const meta = {
  title: 'Dashboards/Common/Map/InteractiveMap',
  component: InteractiveMap,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    points: {
      control: 'object',
      description: 'Array of points to display on the map'
    },
    selectedLocation: {
      control: 'object',
      description: 'Selected location coordinates [lat, lon]'
    }
  },
} satisfies Meta<typeof InteractiveMap>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for the stories
const samplePoints = [
  {
    id: 'point1',
    name: 'Test Point 1',
    date: '2025-02-20',
    coordinates: [-40.7500, 175.1500] // Ōtaki region
  },
  {
    id: 'point2',
    name: 'Test Point 2',
    date: '2025-02-20',
    coordinates: [-40.7600, 175.1600]
  },
  {
    id: 'point3',
    name: 'Test Point 3',
    date: '2025-02-20',
    coordinates: [-40.7700, 175.1700]
  }
];

export const Default: Story = {
  args: {
    points: samplePoints,
    selectedLocation: [-40.7500, 175.1500]
  },
  parameters: {
    docs: {
      description: {
        story: 'Default interactive map showing multiple points in the Ōtaki region'
      }
    }
  }
};

export const SinglePoint: Story = {
  args: {
    points: [samplePoints[0]],
    selectedLocation: samplePoints[0].coordinates
  },
  parameters: {
    docs: {
      description: {
        story: 'Map displaying a single point'
      }
    }
  }
};

export const MultiplePoints: Story = {
  args: {
    points: Array.from({ length: 10 }, (_, i) => ({
      id: `point${i}`,
      name: `Test Point ${i}`,
      date: '2025-02-20',
      coordinates: [
        -40.7500 + (Math.random() - 0.5) * 0.1,
        175.1500 + (Math.random() - 0.5) * 0.1
      ] as [number, number]
    })),
    selectedLocation: [-40.7500, 175.1500]
  },
  parameters: {
    docs: {
      description: {
        story: 'Map with multiple randomly distributed points'
      }
    }
  }
};

export const NoPoints: Story = {
  args: {
    points: [],
    selectedLocation: [-40.7500, 175.1500]
  },
  parameters: {
    docs: {
      description: {
        story: 'Map with no points, showing only the default location'
      }
    }
  }
};

export const CustomZoom: Story = {
  args: {
    points: samplePoints,
    selectedLocation: [-40.7500, 175.1500]
  },
  parameters: {
    docs: {
      description: {
        story: 'Map with custom zoom level'
      }
    }
  }
};
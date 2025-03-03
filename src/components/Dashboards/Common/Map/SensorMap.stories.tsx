import type { Meta, StoryObj } from '@storybook/react';
import { SensorMap } from './SensorMap';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const meta = {
  title: 'Dashboards/Common/Map/SensorMap',
  component: SensorMap,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    locations: {
      control: 'object',
      description: 'Array of sensor locations'
    },
    statusIcons: {
      control: 'object',
      description: 'Map of status icons'
    },
    defaultCenter: {
      control: 'object',
      description: 'Default center coordinates'
    },
    defaultZoom: {
      control: 'number',
      description: 'Default zoom level'
    }
  },
} satisfies Meta<typeof SensorMap>;

export default meta;
type Story = StoryObj<typeof meta>;

// Create custom icons for different status types
const icons = {
  active: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  maintenance: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  fault: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  default: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// Sample sensor locations
const sampleLocations = [
  {
    id: 'sensor1',
    name: 'Dust Monitor 1',
    latitude: -40.7500,
    longitude: 175.1500,
    status: 'active',
    popupContent: (
      <div className="p-2">
        <h3 className="font-medium">Dust Monitor 1</h3>
        <p>Status: Active</p>
        <p>PM10: 25 µg/m³</p>
        <p>PM2.5: 10 µg/m³</p>
      </div>
    )
  },
  {
    id: 'sensor2',
    name: 'Dust Monitor 2',
    latitude: -40.7600,
    longitude: 175.1600,
    status: 'maintenance',
    popupContent: (
      <div className="p-2">
        <h3 className="font-medium">Dust Monitor 2</h3>
        <p>Status: Maintenance</p>
        <p>Scheduled maintenance in progress</p>
      </div>
    )
  },
  {
    id: 'sensor3',
    name: 'Dust Monitor 3',
    latitude: -40.7700,
    longitude: 175.1700,
    status: 'fault',
    popupContent: (
      <div className="p-2">
        <h3 className="font-medium">Dust Monitor 3</h3>
        <p>Status: Fault</p>
        <p>Error: Sensor malfunction</p>
      </div>
    )
  }
];

export const Default: Story = {
  args: {
    locations: sampleLocations,
    statusIcons: icons,
    defaultCenter: [-40.7500, 175.1500],
    defaultZoom: 11
  },
  parameters: {
    docs: {
      description: {
        story: 'Default sensor map showing multiple sensors with different statuses'
      }
    }
  }
};

export const SingleSensor: Story = {
  args: {
    locations: [sampleLocations[0]],
    statusIcons: icons,
    defaultCenter: [-40.7500, 175.1500],
    defaultZoom: 13
  },
  parameters: {
    docs: {
      description: {
        story: 'Map showing a single active sensor'
      }
    }
  }
};

export const AllStatuses: Story = {
  args: {
    locations: [
      ...sampleLocations,
      {
        id: 'sensor4',
        name: 'Dust Monitor 4',
        latitude: -40.7800,
        longitude: 175.1800,
        status: 'default',
        popupContent: (
          <div className="p-2">
            <h3 className="font-medium">Dust Monitor 4</h3>
            <p>Status: Unknown</p>
          </div>
        )
      }
    ],
    statusIcons: icons,
    defaultCenter: [-40.7500, 175.1500],
    defaultZoom: 10
  },
  parameters: {
    docs: {
      description: {
        story: 'Map showing sensors in all possible status states'
      }
    }
  }
};

export const CustomZoom: Story = {
  args: {
    locations: sampleLocations,
    statusIcons: icons,
    defaultCenter: [-40.7500, 175.1500],
    defaultZoom: 14
  },
  parameters: {
    docs: {
      description: {
        story: 'Map with a custom zoom level for closer inspection'
      }
    }
  }
};

export const NoSensors: Story = {
  args: {
    locations: [],
    statusIcons: icons,
    defaultCenter: [-40.7500, 175.1500],
    defaultZoom: 11
  },
  parameters: {
    docs: {
      description: {
        story: 'Map with no sensors, showing only the default location'
      }
    }
  }
};
import {
  ArrowDownUp,
  Waves,
  FlaskConical,
  Hammer,
  TestTubes,
  Scale,
  Container,
  Droplets,
  Microscope,
  Boxes,
  Atom,
  Gauge,
  Ruler,
  Compass,
  Beaker,
  Mountain,
  LucideIcon,
} from 'lucide-react';
import { DisciplineSection } from '../types';

// Helper function to create icon components
const createIcon = (Icon: LucideIcon) => {
  return {
    icon: Icon,
    props: { className: "w-6 h-6" }
  };
};

export const GEOTECHNICAL_SECTIONS: DisciplineSection[] = [
  {
    id: 'field',
    title: 'Field Data',
    icon: Mountain,
    tests: [
      { name: 'Shear Vane', icon: createIcon(Ruler) },
      { 
        name: 'Standard Penetrometer Test (SPT)', 
        icon: createIcon(Compass),
        onClick: undefined // Will be set in GeotechnicalTests component
      },
    ]
  },
  {
    id: 'laboratory',
    title: 'Laboratory Data',
    icon: Beaker,
    tests: [
      { name: '1D Consolidation', icon: createIcon(ArrowDownUp) },
      { name: 'Atterberg Plasticity', icon: createIcon(Waves) },
      { name: 'CD Triaxial', icon: createIcon(FlaskConical) },
      { name: 'Compaction', icon: createIcon(Hammer) },
      { name: 'CU Triaxial', icon: createIcon(TestTubes) },
      { name: 'Direct Shear', icon: createIcon(ArrowDownUp) },
      { name: 'Dry Density', icon: createIcon(Scale) },
      { name: 'Hook Cell', icon: createIcon(Container) },
      { name: 'Moisture Content', icon: createIcon(Droplets) },
      { name: 'Organic Matter', icon: createIcon(Microscope) },
      { name: 'Permeability', icon: createIcon(Waves) },
      { name: 'Particle Size Distribution (PSD)', icon: createIcon(Boxes) },
      { name: 'Slake Durability', icon: createIcon(Atom) },
      { name: 'Unconfined Compressive Strength (UCS)', icon: createIcon(Gauge) },
      { name: 'UU Triaxial', icon: createIcon(TestTubes) },
    ]
  }
];
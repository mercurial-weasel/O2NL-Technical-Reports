import { Mountain, Ruler, Compass, ArrowDownUp, Waves, FlaskConical, Hammer, TestTubes, Scale, Container, Droplets, Microscope, Boxes, Atom, Gauge, Beaker, DivideIcon as LucideIcon } from 'lucide-react';
import { DisciplineSection } from '../AllDisciplines/types';

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
      { 
        name: 'Shear Vane', 
        icon: createIcon(Ruler),
        status: 'not-available'
      },
      { 
        name: 'Standard Penetrometer Test (SPT)', 
        icon: createIcon(Compass),
        status: 'draft',
        onClick: undefined // Will be set in GeotechnicalTests component
      },
    ]
  },
  {
    id: 'laboratory',
    title: 'Laboratory Data',
    icon: Beaker,
    tests: [
      { name: '1D Consolidation', icon: createIcon(ArrowDownUp), status: 'not-available' },
      { name: 'Atterberg Plasticity', icon: createIcon(Waves), status: 'not-available' },
      { name: 'CD Triaxial', icon: createIcon(FlaskConical), status: 'not-available' },
      { name: 'Compaction', icon: createIcon(Hammer), status: 'not-available' },
      { name: 'CU Triaxial', icon: createIcon(TestTubes), status: 'not-available' },
      { name: 'Direct Shear', icon: createIcon(ArrowDownUp), status: 'not-available' },
      { name: 'Dry Density', icon: createIcon(Scale), status: 'not-available' },
      { name: 'Hook Cell', icon: createIcon(Container), status: 'not-available' },
      { name: 'Moisture Content', icon: createIcon(Droplets), status: 'not-available' },
      { name: 'Organic Matter', icon: createIcon(Microscope), status: 'not-available' },
      { name: 'Permeability', icon: createIcon(Waves), status: 'not-available' },
      { name: 'Particle Size Distribution (PSD)', icon: createIcon(Boxes), status: 'not-available' },
      { name: 'Slake Durability', icon: createIcon(Atom), status: 'not-available' },
      { name: 'Unconfined Compressive Strength (UCS)', icon: createIcon(Gauge), status: 'not-available' },
      { name: 'UU Triaxial', icon: createIcon(TestTubes), status: 'not-available' }
    ]
  }
];
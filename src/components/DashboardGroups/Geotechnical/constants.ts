import { Mountain, Ruler, Compass, ArrowDownUp, Waves, FlaskConical, Hammer, TestTubes, Scale, Container, Droplets, Microscope, Boxes, Atom, Gauge, Beaker, DivideIcon as LucideIcon } from 'lucide-react';
import { DisciplineSection } from '../AllDisciplines/types';
import { AccessRight } from '@lib/auth/types';

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
    accessFor: ['test', 'design', 'admin'] as AccessRight[], // Updated to match route config
    tests: [
      { 
        name: 'Shear Vane', 
        icon: createIcon(Ruler),
        status: 'not-available',
        accessFor: ['test', 'design', 'admin']
      },
      { 
        name: 'Standard Penetrometer Test (SPT)', 
        icon: createIcon(Compass),
        status: 'draft',
        onClick: undefined, // Will be set in GeotechnicalTests component
        accessFor: ['test', 'design', 'admin']
      },
    ]
  },
  {
    id: 'laboratory',
    title: 'Laboratory Data',
    icon: Beaker,
    accessFor: ['test', 'design', 'admin'] as AccessRight[], // Updated to match route config
    tests: [
      { name: '1D Consolidation', icon: createIcon(ArrowDownUp), status: 'not-available', accessFor: ['Test', 'Design'] },
      { name: 'California Bearing Ratio (CBR)', icon: createIcon(Gauge), status: 'draft', accessFor: ['test', 'design', 'admin'] },
      { name: 'CD Triaxial', icon: createIcon(FlaskConical), status: 'not-available', accessFor: ['Test', 'Design'] },
      { name: 'Compaction', icon: createIcon(Hammer), status: 'not-available', accessFor: ['Test', 'Design'] },
      { name: 'CU Triaxial', icon: createIcon(TestTubes), status: 'not-available', accessFor: ['Test', 'Design'] },
      { name: 'Direct Shear', icon: createIcon(ArrowDownUp), status: 'not-available', accessFor: ['Test', 'Design'] },
      { name: 'Dry Density', icon: createIcon(Scale), status: 'not-available', accessFor: ['Test', 'Design'] },
      { name: 'Hook Cell', icon: createIcon(Container), status: 'not-available', accessFor: ['Test', 'Design'] },
      { name: 'Lab Grading', icon: createIcon(Boxes), status: 'draft', accessFor: ['test', 'design', 'admin'] },
      { name: 'Maximum Dry Density (MDD)', icon: createIcon(Scale), status: 'draft', accessFor: ['test', 'design', 'admin'] },
      { name: 'Moisture Content', icon: createIcon(Droplets), status: 'not-available', accessFor: ['Test', 'Design'] },
      { name: 'Organic Matter', icon: createIcon(Microscope), status: 'not-available', accessFor: ['Test', 'Design'] },
      { name: 'Permeability', icon: createIcon(Waves), status: 'not-available', accessFor: ['Test', 'Design'] },
      { name: 'Particle Size Distribution (PSD)', icon: createIcon(Boxes), status: 'draft', accessFor: ['test', 'design', 'admin'] },
      { name: 'Atterberg Limits (Plasticity)', icon: createIcon(Waves), status: 'draft', accessFor: ['test', 'design', 'admin'] },
      { name: 'Slake Durability', icon: createIcon(Atom), status: 'not-available', accessFor: ['Test', 'Design'] },
      { name: 'Unconfined Compressive Strength (UCS)', icon: createIcon(Gauge), status: 'not-available', accessFor: ['Test', 'Design'] },
      { name: 'UU Triaxial', icon: createIcon(TestTubes), status: 'not-available', accessFor: ['Test', 'Design'] }
    ]
  }
];
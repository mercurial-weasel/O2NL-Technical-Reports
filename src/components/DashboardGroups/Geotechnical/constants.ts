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
    accessFor: ['AMT', 'Design'] as AccessRight[],
    tests: [
      { 
        name: 'Shear Vane', 
        icon: createIcon(Ruler),
        status: 'not-available',
        accessFor: ['AMT', 'Design']
      },
      { 
        name: 'Standard Penetrometer Test (SPT)', 
        icon: createIcon(Compass),
        status: 'draft',
        onClick: undefined, // Will be set in GeotechnicalTests component
        accessFor: ['AMT', 'Design']
      },
    ]
  },
  {
    id: 'laboratory',
    title: 'Laboratory Data',
    icon: Beaker,
    accessFor: ['Admin', 'Design'] as AccessRight[],
    tests: [
      { name: '1D Consolidation', icon: createIcon(ArrowDownUp), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Atterberg Plasticity', icon: createIcon(Waves), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'CD Triaxial', icon: createIcon(FlaskConical), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Compaction', icon: createIcon(Hammer), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'CU Triaxial', icon: createIcon(TestTubes), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Direct Shear', icon: createIcon(ArrowDownUp), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Dry Density', icon: createIcon(Scale), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Hook Cell', icon: createIcon(Container), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Moisture Content', icon: createIcon(Droplets), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Organic Matter', icon: createIcon(Microscope), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Permeability', icon: createIcon(Waves), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Particle Size Distribution (PSD)', icon: createIcon(Boxes), status: 'draft', accessFor: ['AMT', 'Design'] },
      { name: 'Slake Durability', icon: createIcon(Atom), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Unconfined Compressive Strength (UCS)', icon: createIcon(Gauge), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'UU Triaxial', icon: createIcon(TestTubes), status: 'not-available', accessFor: ['AMT', 'Design'] }
    ]
  }
];
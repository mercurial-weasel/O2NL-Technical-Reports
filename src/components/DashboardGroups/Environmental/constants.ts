import { Leaf, Wind, Droplets, CloudRain, Waves, Mountain, Bird, TreePine, Sprout, TestTubes, Microscope, Beaker, DivideIcon as LucideIcon } from 'lucide-react';
import { DisciplineSection } from '../AllDisciplines/types';
import { AccessRight } from '@lib/auth/types';

// Helper function to create icon components
const createIcon = (Icon: LucideIcon) => {
  return {
    icon: Icon,
    props: { className: "w-6 h-6" }
  };
};

export const ENVIRONMENTAL_SECTIONS: DisciplineSection[] = [
  {
    id: 'field',
    title: 'Field Monitoring',
    icon: Leaf,
    accessFor: ['Admin', 'Design', 'AMT', 'PAB', 'Commercial', 'P+C'] as AccessRight[],
    tests: [
      { 
        name: 'Dust', 
        icon: createIcon(Wind), 
        status: 'concept', 
        accessFor: ['Admin', 'Design', 'AMT', 'PAB', 'Commercial', 'P+C'],
        onClick: undefined // Will be set in EnvironmentalTests component
      },
      { name: 'Air Quality', icon: createIcon(Wind), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Water Quality', icon: createIcon(Droplets), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Rainfall', icon: createIcon(CloudRain), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Noise & Vibration', icon: createIcon(Waves), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Soil Quality', icon: createIcon(Mountain), status: 'not-available', accessFor: ['AMT', 'Design'] }
    ]
  },
  {
    id: 'ecological',
    title: 'Ecological Surveys',
    icon: Bird,
    accessFor: ['Admin', 'Design'] as AccessRight[],
    tests: [
      { name: 'Flora Survey', icon: createIcon(TreePine), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Fauna Survey', icon: createIcon(Bird), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Vegetation Monitoring', icon: createIcon(Sprout), status: 'not-available', accessFor: ['AMT', 'Design'] }
    ]
  },
  {
    id: 'laboratory',
    title: 'Laboratory Analysis',
    icon: Beaker,
    accessFor: ['Admin', 'Design'] as AccessRight[],
    tests: [
      { name: 'Water Analysis', icon: createIcon(TestTubes), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Soil Analysis', icon: createIcon(Microscope), status: 'not-available', accessFor: ['AMT', 'Design'] },
      { name: 'Air Sample Analysis', icon: createIcon(Beaker), status: 'not-available', accessFor: ['AMT', 'Design'] }
    ]
  }
];
import { Leaf, Wind, Droplets, CloudRain, Waves, Mountain, Bird, TreePine, Sprout, TestTubes, Microscope, Beaker, DivideIcon as LucideIcon } from 'lucide-react';
import { DisciplineSection } from '../AllDisciplines/types';

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
    tests: [
      { name: 'Air Quality', icon: createIcon(Wind), status: 'not-available' },
      { name: 'Water Quality', icon: createIcon(Droplets), status: 'not-available' },
      { name: 'Rainfall', icon: createIcon(CloudRain), status: 'not-available' },
      { name: 'Noise & Vibration', icon: createIcon(Waves), status: 'not-available' },
      { name: 'Soil Quality', icon: createIcon(Mountain), status: 'not-available' }
    ]
  },
  {
    id: 'ecological',
    title: 'Ecological Surveys',
    icon: Bird,
    tests: [
      { name: 'Flora Survey', icon: createIcon(TreePine), status: 'not-available' },
      { name: 'Fauna Survey', icon: createIcon(Bird), status: 'not-available' },
      { name: 'Vegetation Monitoring', icon: createIcon(Sprout), status: 'not-available' }
    ]
  },
  {
    id: 'laboratory',
    title: 'Laboratory Analysis',
    icon: Beaker,
    tests: [
      { name: 'Water Analysis', icon: createIcon(TestTubes), status: 'not-available' },
      { name: 'Soil Analysis', icon: createIcon(Microscope), status: 'not-available' },
      { name: 'Air Sample Analysis', icon: createIcon(Beaker), status: 'not-available' }
    ]
  }
];
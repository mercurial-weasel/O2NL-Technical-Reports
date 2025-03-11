import {
  ArrowDownUp,
  AlertTriangle,
  Calendar,
  CheckSquare,
  Target,
  FileText,
  BarChart2,
  Milestone,
  Monitor,
  Users,
  Boxes,
  Leaf,
  DollarSign,
  Clock,
  FileCheck,
  Wrench,
  DivideIcon as LucideIcon
} from 'lucide-react';
import { DisciplineSection } from '../AllDisciplines/types';

// Helper function to create icon components
const createIcon = (Icon: LucideIcon) => {
  return {
    icon: Icon,
    props: { className: "w-6 h-6" }
  };
};

export const PROJECT_CONTROLS_SECTIONS: DisciplineSection[] = [
  {
    id: 'cost',
    title: 'Cost',
    icon: DollarSign,
    accessFor: ['Commercial'],
    tests: [
      { name: 'Cost Performance', icon: createIcon(DollarSign), status: 'not_available', accessFor: ['Commercial'] },
      { name: 'AMT Budget Tracking', icon: createIcon(DollarSign), status: 'draft', accessFor: ['AMT'] },
      { name: 'Earned Value', icon: createIcon(DollarSign), status: 'draft', accessFor: ['Commercial'] }
    ]
  },
  {
    id: 'risk',
    title: 'Risk',
    icon: AlertTriangle,
    accessFor: ['test'],
    tests: [
      { name: 'Risk Register', icon: createIcon(AlertTriangle), status: 'not_available', accessFor: ['test'] },
      { name: 'Risk Analysis', icon: createIcon(AlertTriangle), status: 'not_available', accessFor: ['test'] },
      { name: 'Mitigation Tracking', icon: createIcon(AlertTriangle), status: 'not_available', accessFor: ['test'] }
    ]
  },
  {
    id: 'programme',
    title: 'Programme',
    icon: Calendar,
    accessFor: ['Test'],
    tests: [
      { name: 'PAB Report', icon: createIcon(FileText), status: 'draft', accessFor: ['Test'] },
      { name: 'AMT Report', icon: createIcon(BarChart2), status: 'draft', accessFor: ['Test'] },
      { name: 'Sustainability Report', icon: createIcon(BarChart2), status: 'concept', accessFor: ['Test'] },
      { name: 'Programme Milestones', icon: createIcon(Milestone), status: 'published', accessFor: ['Test'] },
      { name: 'Systems/Software', icon: createIcon(Monitor), status: 'draft', accessFor: ['Test'] },
      { name: 'Consenting', icon: createIcon(FileCheck), status: 'draft', accessFor: ['Test'] }
    ]
  },
  {
    id: 'quality',
    title: 'Quality',
    icon: CheckSquare,
    accessFor: ['Test'],
    tests: [
      { name: 'Quality Metrics', icon: createIcon(CheckSquare), status: 'not_available', accessFor: ['Test'] },
      { name: 'Compliance Reports', icon: createIcon(CheckSquare), status: 'not_available', accessFor: ['Test'] },
      { name: 'Audit Results', icon: createIcon(CheckSquare), status: 'not_available', accessFor: ['Test'] }
    ]
  },
  {
    id: 'scope',
    title: 'Scope',
    icon: Target,
    accessFor: ['Test'],
    tests: [
      { name: 'Scope Changes', icon: createIcon(Target), status: 'not_available', accessFor: ['Test'] },
      { name: 'Requirements Tracking', icon: createIcon(Target), status: 'not_available', accessFor: ['Test'] },
      { name: 'Deliverables Status', icon: createIcon(Target), status: 'not_available', accessFor: ['Test'] }
    ]
  },
  {
    id: 'people-culture',
    title: 'People and Culture',
    icon: Users,
    accessFor: ['people', 'Test', 'AMT'],
    tests: [
      { name: 'Staff Numbers', icon: createIcon(Users), status: 'published', accessFor: ['people', 'Test', 'AMT'] },
      { name: 'Staff FTE', icon: createIcon(Users), status: 'published', accessFor: ['people', 'Test', 'AMT'] },
      { name: 'Staff Movement', icon: createIcon(Users), status: 'published', accessFor: ['people', 'Test', 'AMT'] },
      { name: 'Time Logs', icon: createIcon(Clock), status: 'published', accessFor: ['people', 'Test', 'AMT'] }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    icon: Boxes,
    accessFor: ['Test'],
    tests: [
      { name: 'Sustainability Initiatives', icon: createIcon(Leaf), status: 'concept', accessFor: ['test'] },
      { name: 'Emission Tracking', icon: createIcon(Leaf), status: 'concept', accessFor: ['test'] },
      { name: 'Equipment Status', icon: createIcon(Wrench), status: 'concept', accessFor: ['test'] }
    ]
  }
];
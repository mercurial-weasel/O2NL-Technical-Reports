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
    tests: [
      { name: 'Cost Performance', icon: createIcon(DollarSign), status: 'not_available' },
      { name: 'AMT Budget Tracking', icon: createIcon(DollarSign), status: 'draft' },
      { name: 'Earned Value', icon: createIcon(DollarSign), status: 'draft' }
    ]
  },
  {
    id: 'risk',
    title: 'Risk',
    icon: AlertTriangle,
    tests: [
      { name: 'Risk Register', icon: createIcon(AlertTriangle), status: 'not_available' },
      { name: 'Risk Analysis', icon: createIcon(AlertTriangle), status: 'not_available' },
      { name: 'Mitigation Tracking', icon: createIcon(AlertTriangle), status: 'not_available' }
    ]
  },
  {
    id: 'programme',
    title: 'Programme',
    icon: Calendar,
    tests: [
      { name: 'PAB Report', icon: createIcon(FileText), status: 'draft' },
      { name: 'AMT Report', icon: createIcon(BarChart2), status: 'concept' },
      { name: 'Programme Milestones', icon: createIcon(Milestone), status: 'published' },
      { name: 'Systems/Software', icon: createIcon(Monitor), status: 'draft' }
    ]
  },
  {
    id: 'quality',
    title: 'Quality',
    icon: CheckSquare,
    tests: [
      { name: 'Quality Metrics', icon: createIcon(CheckSquare), status: 'not_available' },
      { name: 'Compliance Reports', icon: createIcon(CheckSquare), status: 'not_available' },
      { name: 'Audit Results', icon: createIcon(CheckSquare), status: 'not_available' }
    ]
  },
  {
    id: 'scope',
    title: 'Scope',
    icon: Target,
    tests: [
      { name: 'Scope Changes', icon: createIcon(Target), status: 'not_available' },
      { name: 'Requirements Tracking', icon: createIcon(Target), status: 'not_available' },
      { name: 'Deliverables Status', icon: createIcon(Target), status: 'not_available' }
    ]
  },
  {
    id: 'people-culture',
    title: 'People and Culture',
    icon: Users,
    tests: [
      { name: 'Staff Numbers', icon: createIcon(Users), status: 'draft' },
      { name: 'Staff FTE', icon: createIcon(Users), status: 'draft' }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    icon: Boxes,
    tests: [
      { name: 'Sustainability Initiatives', icon: createIcon(Leaf), status: 'concept' },
      { name: 'Sustainability Tracking', icon: createIcon(Leaf), status: 'concept' }
    ]
  }
];
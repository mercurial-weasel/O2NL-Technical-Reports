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
    accessFor: ['Commercial', 'AMT', 'Admin'],
    tests: [
      { name: 'Cost Performance', icon: createIcon(DollarSign), status: 'not_available', accessFor: ['Commercial', 'AMT'] },
      { name: 'AMT Budget Tracking', icon: createIcon(DollarSign), status: 'draft', accessFor: ['AMT', 'Commercial'] },
      { name: 'Earned Value', icon: createIcon(DollarSign), status: 'draft', accessFor: ['Commercial', 'AMT'] }
    ]
  },
  {
    id: 'risk',
    title: 'Risk',
    icon: AlertTriangle,
    accessFor: ['Admin', 'Commercial', 'AMT'],
    tests: [
      { name: 'Risk Register', icon: createIcon(AlertTriangle), status: 'not_available', accessFor: ['Commercial', 'AMT'] },
      { name: 'Risk Analysis', icon: createIcon(AlertTriangle), status: 'not_available', accessFor: ['Commercial', 'AMT'] },
      { name: 'Mitigation Tracking', icon: createIcon(AlertTriangle), status: 'not_available', accessFor: ['Commercial', 'AMT'] }
    ]
  },
  {
    id: 'programme',
    title: 'Programme',
    icon: Calendar,
    accessFor: ['Admin', 'PAB', 'AMT'],
    tests: [
      { name: 'PAB Report', icon: createIcon(FileText), status: 'draft', accessFor: ['PAB'] },
      { name: 'AMT Report', icon: createIcon(BarChart2), status: 'draft', accessFor: ['AMT', 'PAB'] },
      { name: 'Sustainability Report', icon: createIcon(BarChart2), status: 'concept', accessFor: ['AMT', 'PAB'] },
      { name: 'Programme Milestones', icon: createIcon(Milestone), status: 'published', accessFor: ['PAB', 'AMT'] },
      { name: 'Systems/Software', icon: createIcon(Monitor), status: 'draft', accessFor: ['AMT'] },
      { name: 'Consenting', icon: createIcon(FileCheck), status: 'draft', accessFor: ['PAB', 'AMT'] }
    ]
  },
  {
    id: 'quality',
    title: 'Quality',
    icon: CheckSquare,
    accessFor: ['AMT'],
    tests: [
      { name: 'Quality Metrics', icon: createIcon(CheckSquare), status: 'not_available', accessFor: ['AMT'] },
      { name: 'Compliance Reports', icon: createIcon(CheckSquare), status: 'not_available', accessFor: ['AMT'] },
      { name: 'Audit Results', icon: createIcon(CheckSquare), status: 'not_available', accessFor: ['AMT'] }
    ]
  },
  {
    id: 'scope',
    title: 'Scope',
    icon: Target,
    accessFor: ['AMT'],
    tests: [
      { name: 'Scope Changes', icon: createIcon(Target), status: 'not_available', accessFor: ['AMT'] },
      { name: 'Requirements Tracking', icon: createIcon(Target), status: 'not_available', accessFor: ['AMT'] },
      { name: 'Deliverables Status', icon: createIcon(Target), status: 'not_available', accessFor: ['AMT'] }
    ]
  },
  {
    id: 'people-culture',
    title: 'People and Culture',
    icon: Users,
    accessFor: ['AMT', 'people'],
    tests: [
      { name: 'Staff Numbers', icon: createIcon(Users), status: 'published', accessFor: ['amt', 'people'] },
      { name: 'Staff FTE', icon: createIcon(Users), status: 'published', accessFor: ['amt', 'people'] },
      { name: 'Staff Movement', icon: createIcon(Users), status: 'published', accessFor: ['amt', 'people'] },
      { name: 'Time Logs', icon: createIcon(Clock), status: 'published', accessFor: ['amt', 'people'] }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    icon: Boxes,
    accessFor: ['Admin', 'Commercial', 'AMT'],
    tests: [
      { name: 'Sustainability Initiatives', icon: createIcon(Leaf), status: 'concept', accessFor: ['test', 'AMT'] },
      { name: 'Emission Tracking', icon: createIcon(Leaf), status: 'concept', accessFor: ['test', 'AMT'] },
      { name: 'Equipment Status', icon: createIcon(Wrench), status: 'concept', accessFor: ['test', 'AMT'] }
    ]
  }
];
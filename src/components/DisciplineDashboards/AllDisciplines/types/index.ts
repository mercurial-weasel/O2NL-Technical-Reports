import { DivideIcon as LucideIcon } from 'lucide-react';

export interface IconConfig {
  icon: LucideIcon;
  props: {
    className: string;
  };
}

export type DisciplineStatus = 'published' | 'draft' | 'concept' | 'not-available';

export interface DisciplineTest {
  name: string;
  icon: IconConfig;
  onClick?: () => void;
  status: DisciplineStatus;
}

export interface DisciplineSection {
  id: string;
  title: string;
  icon: LucideIcon;
  tests: DisciplineTest[];
}

export interface DisciplineProps {
  title: string;
  sections: DisciplineSection[];
}
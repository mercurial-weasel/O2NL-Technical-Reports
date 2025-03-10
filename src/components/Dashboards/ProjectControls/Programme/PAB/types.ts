import { ReactNode } from 'react';

export interface TableRow {
  [key: string]: any;
}

export interface TableColumn {
  field: string;
  title: string;
  align?: 'left' | 'right' | 'center';
  formatter?: (value: any) => ReactNode;
}

export interface TableSection {
  title: string;
  columns: TableColumn[];
  colspan?: number;
}

export interface TableConfig {
  headerColor?: string;
  textColor?: string;
  highlightColor?: string;
  highlightTextColor?: string;
}

export interface TooltipContent {
  content: string;
  x: number;
  y: number;
}

export interface TableProps {
  title: string;
  sections: TableSection[];
  data: TableRow[];
  config?: TableConfig;
  getRowHighlight?: (row: TableRow) => boolean;
  getTooltipContent?: (row: TableRow) => string | null;
}
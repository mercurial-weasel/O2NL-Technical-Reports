import { SustainabilityInitiative } from './types';

export interface ThemeGroup {
  theme: string;
  initiatives: SustainabilityInitiative[];
  stats: {
    total: number;
    implemented: number;
    pending: number;
    delayed: number;
    proposed: number;
    must: number;
    should: number;
  };
}

export function groupInitiativesByTheme(initiatives: SustainabilityInitiative[]): Map<string, ThemeGroup> {
  const groups = new Map<string, ThemeGroup>();

  initiatives.forEach(initiative => {
    if (!groups.has(initiative.theme)) {
      groups.set(initiative.theme, {
        theme: initiative.theme,
        initiatives: [],
        stats: {
          total: 0,
          implemented: 0,
          pending: 0,
          delayed: 0,
          proposed: 0,
          must: 0,
          should: 0
        }
      });
    }

    const group = groups.get(initiative.theme)!;
    group.initiatives.push(initiative);
    group.stats.total++;
    group.stats[initiative.status.toLowerCase()]++;
    group.stats[initiative.mustOrShould.toLowerCase()]++;
  });

  return groups;
}

export function calculateOverallStats(initiatives: SustainabilityInitiative[]) {
  return {
    total: initiatives.length,
    must: initiatives.filter(i => i.mustOrShould === 'Must').length,
    should: initiatives.filter(i => i.mustOrShould === 'Should').length,
    implemented: initiatives.filter(i => i.status === 'Implemented').length,
    pending: initiatives.filter(i => i.status === 'Pending').length,
    delayed: initiatives.filter(i => i.status === 'Delayed').length,
    proposed: initiatives.filter(i => i.status === 'Proposed').length,
  };
}

export function sortInitiativesByDate(initiatives: SustainabilityInitiative[]): SustainabilityInitiative[] {
  return [...initiatives].sort((a, b) => {
    return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
  });
}

export function filterInitiativesByStatus(
  initiatives: SustainabilityInitiative[],
  statuses: Set<string>
): SustainabilityInitiative[] {
  if (statuses.has('all')) {
    return initiatives;
  }
  return initiatives.filter(initiative => statuses.has(initiative.status));
}

export function filterInitiativesByTheme(
  initiatives: SustainabilityInitiative[],
  themes: Set<string>
): SustainabilityInitiative[] {
  if (themes.has('all')) {
    return initiatives;
  }
  return initiatives.filter(initiative => themes.has(initiative.theme));
}
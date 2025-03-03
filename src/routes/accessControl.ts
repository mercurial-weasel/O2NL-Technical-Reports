import { AccessRight } from '../lib/auth/types';

// Define route configuration with access rights
export interface RouteConfig {
  path: string;
  accessRights: AccessRight[];
  children?: RouteConfig[];
}

export const routeConfig: RouteConfig[] = [
  {
    path: '/project-controls',
    accessRights: ['PAB', 'AMT', 'Commercial', 'Admin', 'Design Lead', 'P+C'],
    children: [
      {
        path: '/project-controls/pab',
        accessRights: ['PAB', 'Admin']
      },
      {
        path: '/project-controls/amt',
        accessRights: ['AMT', 'Admin']
      },
      {
        path: '/project-controls/amt/budget',
        accessRights: ['AMT', 'Commercial', 'Admin']
      },
      {
        path: '/project-controls/commercial/earned-value',
        accessRights: ['AMT', 'Commercial', 'Admin']
      },
      {
        path: '/project-controls/staff-numbers',
        accessRights: ['AMT', 'P+C', 'Admin']
      },
      {
        path: '/project-controls/staff-fte',
        accessRights: ['AMT', 'P+C', 'Admin']
      },
      {
        path: '/project-controls/staff-movement',
        accessRights: ['AMT', 'P+C', 'Admin']
      },
      {
        path: '/project-controls/time-logs',
        accessRights: ['AMT', 'P+C', 'Admin']
      },
      {
        path: '/project-controls/systems',
        accessRights: ['AMT', 'Admin']
      },
      {
        path: '/project-controls/milestones',
        accessRights: ['PAB', 'AMT', 'Commercial', 'Admin', 'Design Lead', 'P+C']
      },
      {
        path: '/project-controls/sustainability',
        accessRights: ['AMT', 'Admin', 'General']
      },
      {
        path: '/project-controls/sustainability/:id',
        accessRights: ['AMT', 'PAB', 'Admin']
      },
      {
        path: '/project-controls/emissions',
        accessRights: ['PAB', 'AMT', 'Design Leads', 'General', 'Admin']
      },
      {
        path: '/project-controls/consenting',
        accessRights: ['AMT', 'PAB', 'Design Leads', 'Admin']
      },
      {
        path: '/project-controls/equipment',
        accessRights: ['AMT', 'Design Leads', 'General', 'Admin']
      }
    ]
  },
  {
    path: '/geotechnical',
    accessRights: ['PAB', 'AMT', 'Commercial', 'Admin', 'Design Lead', 'P+C'],
    children: [
      {
        path: '/geotechnical/spt',
        accessRights: ['Design Lead', 'AMT']
      }
    ]
  },
  {
    path: '/environmental',
    accessRights: ['PAB', 'AMT', 'Commercial', 'Admin', 'Design Lead', 'P+C'],
    children: []
  }
];

// Helper function to check if a user has access to a route
export function hasRouteAccess(path: string, userAccessRights: AccessRight[]): boolean {
  // Find the matching route configuration
  const findRouteConfig = (path: string, configs: RouteConfig[]): RouteConfig | undefined => {
    for (const config of configs) {
      if (config.path === path) return config;
      if (config.children) {
        const childConfig = findRouteConfig(path, config.children);
        if (childConfig) return childConfig;
      }
    }
    return undefined;
  };

  const config = findRouteConfig(path, routeConfig);
  if (!config) return false;

  return config.accessRights.some(right => userAccessRights.includes(right));
}

// Helper function to get required access rights for a route
export function getRequiredAccessRights(path: string): AccessRight[] {
  const findRouteConfig = (path: string, configs: RouteConfig[]): RouteConfig | undefined => {
    for (const config of configs) {
      if (config.path === path) return config;
      if (config.children) {
        const childConfig = findRouteConfig(path, config.children);
        if (childConfig) return childConfig;
      }
    }
    return undefined;
  };

  const config = findRouteConfig(path, routeConfig);
  return config?.accessRights || [];
}
export interface TimeLogEntry {
  projectName: string;
  taskName: string;
  userName: string;
  [key: string]: string | number; // For dynamic status_monthYear columns
}

export interface HoursPivot {
  [projectName: string]: {
    [taskName: string]: {
      [userName: string]: {
        [status: string]: {
          [monthYear: string]: number;
        };
      };
    };
  };
}

export interface HoursResponse {
  data: HoursPivot;
  lastUpdated: string;
}
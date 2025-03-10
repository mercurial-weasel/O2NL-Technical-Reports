export interface MilestoneTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  category: string;
  completion: number;
  priority: 'High' | 'Medium' | 'Low';
  dependencies: string[];
  owner: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'pending' | 'at-risk';
  description: string;
}
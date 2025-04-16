
export interface ProjectBudget {
  used: number;
  total: number;
}

export interface ProjectTeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface ProjectManager {
  id: string;
  name: string;
  avatar: string;
}

export interface ProjectData {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'onHold' | 'atRisk';
  progress: number;
  budget?: ProjectBudget;
  riskLevel?: 'low' | 'medium' | 'high';
  startDate?: string;
  endDate?: string;
  projectManager?: string;
  manager?: ProjectManager;
  team?: ProjectTeamMember[];
  hoursWorked?: number;
  estimatedTime?: number;
  margin?: number;
  description?: string;
  lastActivity?: string;
}

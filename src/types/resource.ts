
export interface Resource {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  availability: number;
  skills: string[];
  email: string;
  phone: string;
  avatar?: string;
}

export interface ResourceSummary {
  totalCount: number;
  uniqueRoles: number;
  avgHourlyRate: number;
  avgAvailability: number;
}

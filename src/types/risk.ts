
export type RiskImpact = 'low' | 'medium' | 'high';
export type RiskProbability = 'low' | 'medium' | 'high';
export type RiskStatus = 'identified' | 'mitigated' | 'occurred';

export interface Risk {
  id: string;
  title: string;
  description: string;
  impact: RiskImpact;
  probability: RiskProbability;
  status: RiskStatus;
  mitigationPlan: string;
  project: string;
  createdBy: string;
  createdAt: string;
}

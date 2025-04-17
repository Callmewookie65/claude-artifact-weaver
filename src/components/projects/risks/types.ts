
export interface RiskItem {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  probability: 'low' | 'medium' | 'high';
  status: 'identified' | 'mitigated' | 'occurred';
  mitigationPlan: string;
  project: string;
  createdBy: string;
  createdAt: string;
}


import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RiskItem } from './types';

interface RiskSummaryProps {
  risks: RiskItem[];
  getRiskScore: (risk: RiskItem) => number;
}

export const RiskSummary: React.FC<RiskSummaryProps> = ({ risks, getRiskScore }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">All Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{risks.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">High Risk</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-600">{risks.filter(risk => getRiskScore(risk) >= 6).length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{risks.filter(risk => risk.status === 'identified').length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Mitigated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">{risks.filter(risk => risk.status === 'mitigated').length}</p>
        </CardContent>
      </Card>
    </div>
  );
};

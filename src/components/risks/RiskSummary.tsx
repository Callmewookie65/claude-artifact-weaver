
import { Card, CardContent } from '@/components/ui/card';
import { Risk } from '@/types/risk';

interface RiskSummaryProps {
  risks: Risk[];
  getRiskScore: (risk: Risk) => number;
}

export const RiskSummary = ({ risks, getRiskScore }: RiskSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-0 rounded-xl shadow-sm">
        <CardContent className="pt-6">
          <h2 className="text-lg font-medium mb-2">All Risks</h2>
          <p className="text-3xl font-bold">{risks.length}</p>
        </CardContent>
      </Card>
      <Card className="border-0 rounded-xl shadow-sm">
        <CardContent className="pt-6">
          <h2 className="text-lg font-medium mb-2">High Risk</h2>
          <p className="text-3xl font-bold text-red-600">
            {risks.filter(risk => getRiskScore(risk) >= 6).length}
          </p>
        </CardContent>
      </Card>
      <Card className="border-0 rounded-xl shadow-sm">
        <CardContent className="pt-6">
          <h2 className="text-lg font-medium mb-2">Active</h2>
          <p className="text-3xl font-bold text-blue-600">
            {risks.filter(risk => risk.status === 'identified').length}
          </p>
        </CardContent>
      </Card>
      <Card className="border-0 rounded-xl shadow-sm">
        <CardContent className="pt-6">
          <h2 className="text-lg font-medium mb-2">Mitigated</h2>
          <p className="text-3xl font-bold text-green-600">
            {risks.filter(risk => risk.status === 'mitigated').length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};


import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RiskBadges } from './RiskBadges';
import { Risk } from '@/types/risk';

interface RiskListProps {
  risks: Risk[];
  getRiskScore: (risk: Risk) => number;
  openRiskModal: (risk: Risk) => void;
}

export const RiskList = ({ risks, getRiskScore, openRiskModal }: RiskListProps) => {
  const { getRiskLevelBadge, getImpactBadge, getProbabilityBadge, getStatusBadge } = RiskBadges({ getRiskScore });

  return (
    <Card className="border-0 rounded-xl shadow-sm">
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Risk</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.map((risk) => (
              <TableRow 
                key={risk.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => openRiskModal(risk)}
              >
                <TableCell>
                  <div className="font-medium">{risk.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">{risk.description}</div>
                </TableCell>
                <TableCell>
                  {risk.project}
                </TableCell>
                <TableCell>
                  {getImpactBadge(risk.impact)}
                </TableCell>
                <TableCell>
                  {getProbabilityBadge(risk.probability)}
                </TableCell>
                <TableCell>
                  {getRiskLevelBadge(risk.impact, risk.probability)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(risk.status)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(risk.createdAt).toLocaleDateString('pl-PL')}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      openRiskModal(risk);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {risks.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No risks matching the filter criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

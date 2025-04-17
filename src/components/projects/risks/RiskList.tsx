
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Filter } from 'lucide-react';
import { RiskItem } from './types';
import { useRiskBadges } from './useRiskBadges';

interface RiskListProps {
  risks: RiskItem[];
  getRiskScore: (risk: RiskItem) => number;
  openRiskModal: (risk: RiskItem) => void;
}

export const RiskList: React.FC<RiskListProps> = ({ risks, getRiskScore, openRiskModal }) => {
  const { getRiskLevelBadge, getImpactBadge, getProbabilityBadge, getStatusBadge } = useRiskBadges(getRiskScore);
  
  // Sort risks by score
  const sortedRisks = [...risks].sort((a, b) => getRiskScore(b) - getRiskScore(a));

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between flex-wrap gap-2">
          <div>
            <CardTitle>Risk Matrix</CardTitle>
            <CardDescription>Current project risks assessment</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Risk</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRisks.map((risk) => (
              <TableRow 
                key={risk.id} 
                className="cursor-pointer hover:bg-accent"
                onClick={() => openRiskModal(risk)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{risk.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{risk.description}</div>
                  </div>
                </TableCell>
                <TableCell>{getImpactBadge(risk.impact)}</TableCell>
                <TableCell>{getProbabilityBadge(risk.probability)}</TableCell>
                <TableCell>{getRiskLevelBadge(risk.impact, risk.probability)}</TableCell>
                <TableCell>{getStatusBadge(risk.status)}</TableCell>
                <TableCell>{new Date(risk.createdAt).toLocaleDateString('pl-PL')}</TableCell>
              </TableRow>
            ))}
            {sortedRisks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-muted-foreground">No risks found</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="ml-auto">
          <ArrowUpRight className="h-4 w-4 mr-2" />
          View All Risks
        </Button>
      </CardFooter>
    </Card>
  );
};

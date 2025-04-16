import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Filter, PlusCircle, ArrowUpRight, Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProjectData } from '@/types/project';

interface RiskItem {
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

interface ProjectRisksProps {
  project: ProjectData;
}

export const ProjectRisks: React.FC<ProjectRisksProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRisk, setCurrentRisk] = useState<RiskItem | null>(null);
  
  // Sample risk data
  const risks: RiskItem[] = [
    {
      id: '1',
      title: 'Opóźnienia w dostarczaniu treści',
      description: 'Klient może nie dostarczyć treści na czas, co wpłynie na termin realizacji.',
      impact: 'medium',
      probability: 'high',
      status: 'identified',
      mitigationPlan: 'Ustalić harmonogram dostarczania treści i przypominać o terminach.',
      project: project.name,
      createdBy: 'Jan Kowalski',
      createdAt: '2025-03-15'
    },
    {
      id: '2',
      title: 'Zmiany w specyfikacji',
      description: 'Klient może wprowadzać zmiany w specyfikacji w trakcie realizacji projektu.',
      impact: 'high',
      probability: 'medium',
      status: 'identified',
      mitigationPlan: 'Wprowadzić formalne procedury zarządzania zmianami.',
      project: project.name,
      createdBy: 'Jan Kowalski',
      createdAt: '2025-03-16'
    },
  ];
  
  // Calculate risk score
  const getRiskScore = (risk: RiskItem) => {
    const impactScore = { low: 1, medium: 2, high: 3 };
    const probabilityScore = { low: 1, medium: 2, high: 3 };
    
    return impactScore[risk.impact] * probabilityScore[risk.probability];
  };
  
  // Sort risks by score
  const sortedRisks = [...risks].sort((a, b) => getRiskScore(b) - getRiskScore(a));
  
  // Get risk level badge
  const getRiskLevelBadge = (impact: string, probability: string) => {
    const score = getRiskScore({ impact, probability } as RiskItem);
    
    if (score >= 6) {
      return <Badge variant="destructive">Wysoki</Badge>;
    } else if (score >= 3) {
      return <Badge variant="secondary" className="bg-yellow-500">Średni</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-500 text-white">Niski</Badge>;
    }
  };
  
  // Get impact badge
  const getImpactBadge = (impact: string) => {
    switch(impact) {
      case 'low':
        return <Badge variant="outline" className="bg-green-500 text-white">Niski</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500">Średni</Badge>;
      case 'high':
        return <Badge variant="destructive">Wysoki</Badge>;
      default:
        return <Badge variant="outline">{impact}</Badge>;
    }
  };
  
  // Get probability badge
  const getProbabilityBadge = (probability: string) => {
    switch(probability) {
      case 'low':
        return <Badge variant="outline" className="bg-green-500 text-white">Niskie</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500">Średnie</Badge>;
      case 'high':
        return <Badge variant="destructive">Wysokie</Badge>;
      default:
        return <Badge variant="outline">{probability}</Badge>;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'identified':
        return <Badge className="bg-blue-500 text-white">Zidentyfikowane</Badge>;
      case 'mitigated':
        return <Badge variant="outline" className="bg-green-500 text-white">Zminimalizowane</Badge>;
      case 'occurred':
        return <Badge variant="destructive">Wystąpiło</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Open risk modal for editing or creating
  const openRiskModal = (risk: RiskItem | null = null) => {
    setCurrentRisk(risk);
    setIsModalOpen(true);
  };
  
  // Close risk modal
  const closeRiskModal = () => {
    setIsModalOpen(false);
    setCurrentRisk(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Project Risks</h2>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
            <Button variant="link" className="p-0 h-auto ml-2" asChild>
              <a href="#" className="inline-flex items-center">
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </a>
            </Button>
          </p>
        </div>
        <Button onClick={() => openRiskModal()}>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Add Risk
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
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

      {/* Risk summary cards would go here */}
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

      {/* Risk Modal would go here but we'll just show a placeholder for now */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>{currentRisk ? 'Edit Risk' : 'Add Risk'}</CardTitle>
              <CardDescription>
                {currentRisk ? 'Edit risk details' : 'Create a new risk entry'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Risk form would go here</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={closeRiskModal}>Cancel</Button>
              <Button>{currentRisk ? 'Update' : 'Create'}</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

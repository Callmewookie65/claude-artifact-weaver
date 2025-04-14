import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type Risk = {
  id: string;
  title: string;
  description: string;
  impact: string;
  probability: string;
  status: string;
  mitigationPlan: string;
  project: string;
  createdBy: string;
  createdAt: string;
};

export default function RisksPage() {
  const initialRisks: Risk[] = [
    {
      id: '1',
      title: 'Opóźnienia w dostarczaniu treści',
      description: 'Klient może nie dostarczyć treści na czas, co wpłynie na termin realizacji.',
      impact: 'medium',
      probability: 'high',
      status: 'identified',
      mitigationPlan: 'Ustalić harmonogram dostarczania treści i przypominać o terminach.',
      project: 'Redesign Strony Głównej',
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
      project: 'Redesign Strony Głównej',
      createdBy: 'Jan Kowalski',
      createdAt: '2025-03-16'
    },
    {
      id: '3',
      title: 'Problemy z integracją API',
      description: 'Mogą wystąpić trudności z integracją z zewnętrznym API.',
      impact: 'high',
      probability: 'medium',
      status: 'identified',
      mitigationPlan: 'Przeprowadzić wczesne testy integracji i przygotować plan awaryjny.',
      project: 'Aplikacja Mobilna',
      createdBy: 'Piotr Wiśniewski',
      createdAt: '2025-03-18'
    },
    {
      id: '4',
      title: 'Przekroczenie budżetu',
      description: 'Ze względu na złożoność migracji istnieje ryzyko przekroczenia budżetu.',
      impact: 'high',
      probability: 'high',
      status: 'occurred',
      mitigationPlan: 'Poinformować klienta o dodatkowych kosztach i przygotować zaktualizowany budżet.',
      project: 'System CRM',
      createdBy: 'Jan Kowalski',
      createdAt: '2025-03-20'
    },
    {
      id: '5',
      title: 'Problemy z wydajnością aplikacji',
      description: 'Aplikacja może nie spełniać wymagań wydajnościowych po uruchomieniu na produkcji.',
      impact: 'medium',
      probability: 'medium',
      status: 'identified',
      mitigationPlan: 'Przeprowadzić testy wydajnościowe przed wdrożeniem na produkcję.',
      project: 'Aplikacja Mobilna',
      createdBy: 'Anna Nowak',
      createdAt: '2025-03-21'
    },
    {
      id: '6',
      title: 'Opóźnienie w dostawie sprzętu',
      description: 'Dostawca sprzętu może nie dostarczyć zamówionego wyposażenia na czas.',
      impact: 'medium',
      probability: 'low',
      status: 'mitigated',
      mitigationPlan: 'Zamówić sprzęt z wyprzedzeniem i mieć alternatywnego dostawcę.',
      project: 'System CRM',
      createdBy: 'Piotr Wiśniewski',
      createdAt: '2025-03-22'
    }
  ];

  const [risks, setRisks] = useState<Risk[]>(initialRisks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRisk, setCurrentRisk] = useState<Risk | null>(null);
  const [filterImpact, setFilterImpact] = useState('all');
  const [filterProbability, setFilterProbability] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const projects = [...new Set(risks.map(risk => risk.project))];
  
  const openRiskModal = (risk: Risk | null = null) => {
    setCurrentRisk(risk);
    setIsModalOpen(true);
  };
  
  const closeRiskModal = () => {
    setIsModalOpen(false);
    setCurrentRisk(null);
  };

  const saveRisk = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const updatedRisk: Risk = {
      id: currentRisk?.id || Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      impact: formData.get('impact') as string,
      probability: formData.get('probability') as string,
      status: formData.get('status') as string,
      mitigationPlan: formData.get('mitigationPlan') as string,
      project: formData.get('project') as string,
      createdBy: currentRisk?.createdBy || 'Jan Kowalski',
      createdAt: currentRisk?.createdAt || new Date().toISOString().split('T')[0]
    };

    if (currentRisk) {
      setRisks(risks.map(risk => risk.id === currentRisk.id ? updatedRisk : risk));
      toast({
        title: "Risk updated",
        description: "Changes were saved successfully."
      });
    } else {
      setRisks([...risks, updatedRisk]);
      toast({
        title: "Risk added",
        description: "New risk was added successfully."
      });
    }
    
    closeRiskModal();
  };

  const deleteRisk = () => {
    if (currentRisk) {
      setRisks(risks.filter(risk => risk.id !== currentRisk.id));
      toast({
        title: "Risk deleted",
        description: "Risk was deleted successfully.",
        variant: "destructive"
      });
      closeRiskModal();
    }
  };
  
  const filteredRisks = risks.filter(risk => {
    return (
      (filterImpact === 'all' || risk.impact === filterImpact) &&
      (filterProbability === 'all' || risk.probability === filterProbability) &&
      (filterStatus === 'all' || risk.status === filterStatus) &&
      (filterProject === 'all' || risk.project === filterProject) &&
      (searchQuery === '' || 
        risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });
  
  const getRiskScore = (risk) => {
    const impactScore = { low: 1, medium: 2, high: 3 };
    const probabilityScore = { low: 1, medium: 2, high: 3 };
    
    return impactScore[risk.impact] * probabilityScore[risk.probability];
  };
  
  const sortedRisks = [...filteredRisks].sort((a, b) => getRiskScore(b) - getRiskScore(a));
  
  const getRiskLevelBadge = (impact, probability) => {
    const score = getRiskScore({ impact, probability });
    
    if (score >= 6) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High</Badge>;
    } else if (score >= 3) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low</Badge>;
    }
  };
  
  const getImpactBadge = (impact) => {
    switch(impact) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{impact}</Badge>;
    }
  };
  
  const getProbabilityBadge = (probability) => {
    switch(probability) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Low</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">High</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{probability}</Badge>;
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'identified':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Identified</Badge>;
      case 'mitigated':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Mitigated</Badge>;
      case 'occurred':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Occurred</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-custom">Risks</h1>
        <Button className="bg-black text-white hover:bg-black/90" onClick={() => openRiskModal()}>
          Add Risk
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-1 text-[#555]">
            Search
          </label>
          <Input
            id="search"
            placeholder="Search risks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border-[#eee] focus:border-black"
          />
        </div>
        <div>
          <label htmlFor="impact" className="block text-sm font-medium mb-1">
            Impact
          </label>
          <select
            id="impact"
            className="w-full p-2 border rounded"
            value={filterImpact}
            onChange={(e) => setFilterImpact(e.target.value)}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="probability" className="block text-sm font-medium mb-1">
            Probability
          </label>
          <select
            id="probability"
            className="w-full p-2 border rounded"
            value={filterProbability}
            onChange={(e) => setFilterProbability(e.target.value)}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            className="w-full p-2 border rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="identified">Identified</option>
            <option value="mitigated">Mitigated</option>
            <option value="occurred">Occurred</option>
          </select>
        </div>
        <div>
          <label htmlFor="project" className="block text-sm font-medium mb-1">
            Project
          </label>
          <select
            id="project"
            className="w-full p-2 border rounded"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
          >
            <option value="all">All</option>
            {projects.map(project => (
              <option key={project} value={project}>{project}</option>
            ))}
          </select>
        </div>
      </div>
      
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
              {sortedRisks.map((risk) => (
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
              {sortedRisks.length === 0 && (
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
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white rounded-xl border-0">
          <DialogHeader>
            <DialogTitle>{currentRisk ? 'Edit Risk' : 'New Risk'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveRisk}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={currentRisk?.title}
                  placeholder="Risk title"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={currentRisk?.description}
                  placeholder="Risk description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="impact" className="text-sm font-medium">Impact</label>
                  <select
                    id="impact"
                    name="impact"
                    className="w-full p-2 border rounded"
                    defaultValue={currentRisk?.impact || 'medium'}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="probability" className="text-sm font-medium">Probability</label>
                  <select
                    id="probability"
                    name="probability"
                    className="w-full p-2 border rounded"
                    defaultValue={currentRisk?.probability || 'medium'}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="status" className="text-sm font-medium">Status</label>
                  <select
                    id="status"
                    name="status"
                    className="w-full p-2 border rounded"
                    defaultValue={currentRisk?.status || 'identified'}
                  >
                    <option value="identified">Identified</option>
                    <option value="mitigated">Mitigated</option>
                    <option value="occurred">Occurred</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="project" className="text-sm font-medium">Project</label>
                  <select
                    id="project"
                    name="project"
                    className="w-full p-2 border rounded"
                    defaultValue={currentRisk?.project}
                    required
                  >
                    {projects.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="mitigationPlan" className="text-sm font-medium">Mitigation Plan</label>
                <textarea
                  id="mitigationPlan"
                  name="mitigationPlan"
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={currentRisk?.mitigationPlan}
                  placeholder="Describe the mitigation plan"
                />
              </div>
            </div>
            
            <DialogFooter>
              {currentRisk && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={deleteRisk}
                >
                  Delete
                </Button>
              )}
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeRiskModal}
              >
                Cancel
              </Button>
              <Button type="submit">
                {currentRisk ? 'Save Changes' : 'Add Risk'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

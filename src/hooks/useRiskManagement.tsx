
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Risk } from '@/types/risk';

export const useRiskManagement = (initialRisks: Risk[]) => {
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
      impact: formData.get('impact') as Risk['impact'],
      probability: formData.get('probability') as Risk['probability'],
      status: formData.get('status') as Risk['status'],
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
  
  const getRiskScore = (risk: Risk) => {
    const impactScore = { low: 1, medium: 2, high: 3 };
    const probabilityScore = { low: 1, medium: 2, high: 3 };
    
    return impactScore[risk.impact] * probabilityScore[risk.probability];
  };
  
  const sortedRisks = [...filteredRisks].sort((a, b) => getRiskScore(b) - getRiskScore(a));

  return {
    risks,
    isModalOpen,
    currentRisk,
    filterImpact,
    setFilterImpact,
    filterProbability,
    setFilterProbability,
    filterStatus,
    setFilterStatus,
    filterProject,
    setFilterProject,
    searchQuery,
    setSearchQuery,
    projects,
    openRiskModal,
    closeRiskModal,
    saveRisk,
    deleteRisk,
    sortedRisks,
    getRiskScore
  };
};


import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { RiskItem } from './types';

export const useRiskManagement = (initialRisks: RiskItem[]) => {
  const [risks, setRisks] = useState<RiskItem[]>(initialRisks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRisk, setCurrentRisk] = useState<RiskItem | null>(null);
  
  // Calculate risk score
  const getRiskScore = (risk: RiskItem) => {
    const impactScore = { low: 1, medium: 2, high: 3 };
    const probabilityScore = { low: 1, medium: 2, high: 3 };
    
    return impactScore[risk.impact] * probabilityScore[risk.probability];
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

  // Save or update risk
  const saveRisk = (updatedRisk: RiskItem) => {
    if (currentRisk) {
      setRisks(risks.map(risk => risk.id === currentRisk.id ? updatedRisk : risk));
      toast({
        title: "Risk Updated",
        description: "Risk has been updated successfully"
      });
    } else {
      setRisks([...risks, updatedRisk]);
      toast({
        title: "Risk Added",
        description: "New risk has been added successfully"
      });
    }
    
    closeRiskModal();
  };

  // Delete risk
  const deleteRisk = () => {
    if (currentRisk) {
      setRisks(risks.filter(risk => risk.id !== currentRisk.id));
      toast({
        title: "Risk Deleted",
        description: "Risk has been deleted successfully",
        variant: "destructive"
      });
      closeRiskModal();
    }
  };

  return {
    risks,
    isModalOpen,
    currentRisk,
    getRiskScore,
    openRiskModal,
    closeRiskModal,
    saveRisk,
    deleteRisk
  };
};

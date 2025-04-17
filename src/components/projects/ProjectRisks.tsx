
import React from 'react';
import { RiskHeader } from './risks/RiskHeader';
import { RiskSummary } from './risks/RiskSummary';
import { RiskList } from './risks/RiskList';
import { RiskModal } from './risks/RiskModal';
import { useRiskManagement } from './risks/useRiskManagement';
import { ProjectData } from '@/types/project';
import { RiskItem } from './risks/types';

interface ProjectRisksProps {
  project: ProjectData;
}

export const ProjectRisks: React.FC<ProjectRisksProps> = ({ project }) => {
  // Sample risk data
  const initialRisks: RiskItem[] = [
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

  const {
    risks,
    isModalOpen,
    currentRisk,
    getRiskScore,
    openRiskModal,
    closeRiskModal
  } = useRiskManagement(initialRisks);

  return (
    <div className="space-y-4 mb-10">
      <RiskHeader 
        project={project} 
        risks={risks} 
        openRiskModal={() => openRiskModal()}
      />

      <RiskSummary risks={risks} getRiskScore={getRiskScore} />
      
      <RiskList 
        risks={risks} 
        getRiskScore={getRiskScore}
        openRiskModal={openRiskModal}
      />
      
      <RiskModal 
        isModalOpen={isModalOpen}
        closeRiskModal={closeRiskModal}
        currentRisk={currentRisk}
        projects={[project.name]}
      />
    </div>
  );
};

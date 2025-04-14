
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { RiskSummary } from '@/components/risks/RiskSummary';
import { RiskFilters } from '@/components/risks/RiskFilters';
import { RiskList } from '@/components/risks/RiskList';
import { RiskModal } from '@/components/risks/RiskModal';
import { useRiskManagement } from '@/hooks/useRiskManagement';
import { Risk } from '@/types/risk';

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

  const { 
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
  } = useRiskManagement(initialRisks);
  
  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-custom">Risks</h1>
        <Button className="bg-black text-white hover:bg-black/90" onClick={() => openRiskModal()}>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Add Risk
        </Button>
      </div>
      
      <RiskFilters 
        filterImpact={filterImpact}
        setFilterImpact={setFilterImpact}
        filterProbability={filterProbability}
        setFilterProbability={setFilterProbability}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterProject={filterProject}
        setFilterProject={setFilterProject}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        projects={projects}
      />
      
      <RiskSummary risks={initialRisks} getRiskScore={getRiskScore} />
      
      <RiskList 
        risks={sortedRisks} 
        getRiskScore={getRiskScore}
        openRiskModal={openRiskModal}
      />
      
      <RiskModal 
        isOpen={isModalOpen}
        onClose={closeRiskModal}
        currentRisk={currentRisk}
        onSave={saveRisk}
        onDelete={deleteRisk}
        projects={projects}
      />
    </div>
  );
}

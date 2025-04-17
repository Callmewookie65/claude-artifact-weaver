
import { toast } from '@/hooks/use-toast';
import { RiskItem } from './types';

export const useRiskExport = (project: { id: string, name: string }) => {
  // Export risks as CSV
  const exportRisksCSV = (risks: RiskItem[]) => {
    const headers = "id,title,description,impact,probability,status,mitigationPlan,project,createdBy,createdAt\n";
    
    const rows = risks.map(risk => (
      `"${risk.id}","${risk.title.replace(/"/g, '""')}","${risk.description.replace(/"/g, '""')}","${risk.impact}","${risk.probability}","${risk.status}","${risk.mitigationPlan.replace(/"/g, '""')}","${risk.project.replace(/"/g, '""')}","${risk.createdBy}","${risk.createdAt}"`
    )).join('\n');
    
    const csvContent = `${headers}${rows}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `project-${project.id}-risks.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Risks Exported",
      description: "Risk assessment data has been exported as CSV"
    });
  };

  return { exportRisksCSV };
};

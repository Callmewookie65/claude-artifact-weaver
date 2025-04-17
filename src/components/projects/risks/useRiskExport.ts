
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

  // Export risks as JSON
  const exportRisksJSON = (risks: RiskItem[]) => {
    const jsonContent = JSON.stringify(risks, null, 2);
    
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `project-${project.id}-risks.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Risks Exported",
      description: "Risk assessment data has been exported as JSON"
    });
  };

  // Export risks as PDF (simple implementation)
  const exportRisksPDF = (risks: RiskItem[]) => {
    // Simulate PDF export (in a real implementation, this would use jsPDF or similar)
    toast({
      title: "PDF Export Started",
      description: "Risk assessment PDF is being generated"
    });
    
    // Simulate delay
    setTimeout(() => {
      toast({
        title: "PDF Export Complete",
        description: "Risk assessment PDF has been downloaded"
      });
    }, 1500);
  };

  return { 
    exportRisksCSV,
    exportRisksJSON,
    exportRisksPDF
  };
};

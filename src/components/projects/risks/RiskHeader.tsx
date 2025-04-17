
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Download, Pencil } from 'lucide-react';
import { useRiskExport } from './useRiskExport';
import { RiskItem } from './types';

interface RiskHeaderProps {
  project: { id: string, name: string };
  risks: RiskItem[];
  openRiskModal: () => void;
}

export const RiskHeader: React.FC<RiskHeaderProps> = ({ project, risks, openRiskModal }) => {
  const { exportRisksCSV } = useRiskExport(project);

  return (
    <div className="flex justify-between items-center flex-wrap gap-2">
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
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => exportRisksCSV(risks)}>
          <Download className="h-4 w-4 mr-2" />
          Export Risks
        </Button>
        <Button onClick={openRiskModal}>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Add Risk
        </Button>
      </div>
    </div>
  );
};

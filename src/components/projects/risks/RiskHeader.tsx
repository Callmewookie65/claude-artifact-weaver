
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Download, 
  FileDown, 
  FileText,
  FilePlus,
  MoreHorizontal
} from 'lucide-react';
import { useRiskExport } from './useRiskExport';
import { RiskItem } from './types';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface RiskHeaderProps {
  project: { id: string, name: string };
  risks: RiskItem[];
  openRiskModal: () => void;
}

export const RiskHeader: React.FC<RiskHeaderProps> = ({ project, risks, openRiskModal }) => {
  const { exportRisksCSV, exportRisksJSON, exportRisksPDF } = useRiskExport(project);

  return (
    <div className="flex justify-between items-center flex-wrap gap-2">
      <div>
        <h2 className="text-2xl font-bold">Project Risks</h2>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
              <MoreHorizontal className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => exportRisksCSV(risks)}>
              <FileDown className="h-4 w-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportRisksJSON(risks)}>
              <FileText className="h-4 w-4 mr-2" />
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportRisksPDF(risks)}>
              <FilePlus className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={openRiskModal}>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Add Risk
        </Button>
      </div>
    </div>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, ArrowUpDown, Download } from 'lucide-react';
import { ProjectCSVImport, ProjectData } from '@/components/projects/ProjectCSVImport';
import { BudgetCSVImport } from '@/components/projects/BudgetCSVImport';

interface ProjectsHeaderProps {
  handleDownloadTemplate: () => void;
  handleImportProjects: (importedProjects: ProjectData[]) => void;
  handleBudgetImport: (budgetMap: Record<string, { used: number; total: number }>) => void;
  handleDownloadBudgetTemplate: () => void;
}

export const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  handleDownloadTemplate,
  handleImportProjects,
  handleBudgetImport,
  handleDownloadBudgetTemplate
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-3xl font-bold">Projects</h1>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort
        </Button>
        <ProjectCSVImport 
          onImport={handleImportProjects} 
          onDownloadTemplate={handleDownloadTemplate} 
        />
        <BudgetCSVImport 
          onImport={handleBudgetImport}
          onDownloadTemplate={handleDownloadBudgetTemplate}
        />
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
    </div>
  );
};

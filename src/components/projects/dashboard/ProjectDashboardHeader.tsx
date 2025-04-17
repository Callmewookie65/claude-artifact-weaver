
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer, PencilIcon } from 'lucide-react';
import { ProjectData } from '@/types/project';

interface ProjectDashboardHeaderProps {
  project: ProjectData;
  exportToPNG: () => void;
  exportToPDF: () => void;
}

export const ProjectDashboardHeader: React.FC<ProjectDashboardHeaderProps> = ({ 
  project, 
  exportToPNG, 
  exportToPDF 
}) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-2">
      <div>
        <h2 className="text-2xl font-bold">Project Dashboard</h2>
        <p className="text-muted-foreground">
          Report generated: {new Date().toLocaleDateString()} | Project period: {
            project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} - {
            project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
          <Button variant="link" className="p-0 h-auto ml-2">
            <a href="#" className="inline-flex items-center">
              <PencilIcon className="h-3 w-3 mr-1" />
              Edit
            </a>
          </Button>
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={exportToPNG} variant="outline" size="sm" className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-md hover:bg-white/10 dark:text-white">
          <Download className="h-4 w-4 mr-2" />
          Export PNG
        </Button>
        <Button onClick={exportToPDF} variant="outline" size="sm" className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-md hover:bg-white/10 dark:text-white">
          <Printer className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  );
};

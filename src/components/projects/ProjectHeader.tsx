
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileUp, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ProjectData } from '@/types/project';
import { ImportCSVDialog } from './ImportCSVDialog';

interface ProjectHeaderProps {
  project: ProjectData;
  onImportCSV: (data: Record<string, any>) => void;
  onDownloadTemplate: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onImportCSV, onDownloadTemplate }) => {
  const navigate = useNavigate();
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': 
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'completed': 
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      case 'onHold': 
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">On Hold</Badge>;
      case 'atRisk': 
        return <Badge className="bg-red-100 text-red-800 border-red-200">At Risk</Badge>;
      default: 
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="flex justify-between items-center gap-4 flex-wrap">
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-muted-foreground">{project.client}</span>
            {getStatusBadge(project.status)}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <ImportCSVDialog onImport={onImportCSV} />
        <Button 
          variant="outline" 
          onClick={onDownloadTemplate}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Template
        </Button>
        <Button>
          Edit Project
        </Button>
      </div>
    </div>
  );
};

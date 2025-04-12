
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Activity } from 'lucide-react';
import { ProjectCSVImport } from './ProjectCSVImport';
import { ProjectData } from './ProjectCSVImport';

interface ProjectHeaderProps {
  project: ProjectData;
  onImportCSV: (data: ProjectData[]) => void;
  onDownloadTemplate: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  project, 
  onImportCSV, 
  onDownloadTemplate 
}) => {
  const navigate = useNavigate();
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed': return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'onHold': return <Badge className="bg-yellow-100 text-yellow-800">On Hold</Badge>;
      case 'atRisk': return <Badge className="bg-red-100 text-red-800">At Risk</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{project.name}</h1>
        {getStatusBadge(project.status)}
      </div>
      <div className="flex space-x-2">
        <ProjectCSVImport 
          onImport={onImportCSV}
          onDownloadTemplate={onDownloadTemplate}
        />
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button>
          <Activity className="h-4 w-4 mr-2" />
          Actions
        </Button>
      </div>
    </div>
  );
};

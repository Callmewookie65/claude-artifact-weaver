
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, FileUp, Download, Database, 
  FilePlus, Settings, Share2, Calendar, FileDown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ProjectData } from '@/types/project';
import { ImportCSVDialog } from './ImportCSVDialog';
import { toast } from '@/hooks/use-toast';

interface ProjectHeaderProps {
  project: ProjectData;
  onImportCSV: (data: Record<string, any>) => void;
  onDownloadTemplate: () => void;
  onToggleConfluenceImport?: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  project, 
  onImportCSV, 
  onDownloadTemplate,
  onToggleConfluenceImport
}) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  
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

  // Export project data
  const exportProjectData = () => {
    const projectData = JSON.stringify(project, null, 2);
    const blob = new Blob([projectData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `project-${project.id}-data.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Project Data Exported",
      description: "Project data has been exported as JSON"
    });
  };

  // Schedule project meeting
  const scheduleProjectMeeting = () => {
    // This would integrate with calendar services in a real app
    toast({
      title: "Schedule Meeting",
      description: "Calendar integration would open here"
    });
  };

  // Share project
  const shareProject = () => {
    // This would open sharing options in a real app
    toast({
      title: "Share Project",
      description: "Sharing options would open here"
    });
  };
  
  return (
    <div className="flex justify-between items-center gap-4 flex-wrap mb-6">
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">
            {project.name}
          </h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-muted-foreground">{project.client}</span>
            {getStatusBadge(project.status)}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setShowActions(!showActions)}>
          <Settings className="h-4 w-4 mr-2" />
          Actions
        </Button>
        
        {showActions && (
          <div className="absolute right-0 mt-10 z-10 bg-white shadow-lg rounded-md p-2 border w-56">
            <Button variant="ghost" className="w-full justify-start" onClick={exportProjectData}>
              <FileDown className="h-4 w-4 mr-2" />
              Export Project Data
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={scheduleProjectMeeting}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={shareProject}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Project
            </Button>
          </div>
        )}
        
        <ImportCSVDialog onImport={onImportCSV} />
        
        <Button 
          variant="outline" 
          onClick={onDownloadTemplate}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Template
        </Button>
        
        {onToggleConfluenceImport && (
          <Button
            variant="outline"
            onClick={onToggleConfluenceImport}
          >
            <Database className="h-4 w-4 mr-2" />
            Confluence Import
          </Button>
        )}
        
        <Button>
          <FilePlus className="h-4 w-4 mr-2" />
          Edit Project
        </Button>
      </div>
    </div>
  );
};

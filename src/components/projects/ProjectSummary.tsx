import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProjectData } from '@/types/project';

interface ProjectSummaryProps {
  project: ProjectData;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({ project }) => {
  const getRiskBadge = (level: string) => {
    switch(level) {
      case 'low': return <Badge variant="outline" className="bg-green-100 text-green-800">Low</Badge>;
      case 'medium': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'high': return <Badge variant="outline" className="bg-red-100 text-red-800">High</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">Client</h2>
        <p>{project.client}</p>
      </div>
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">Project Manager</h2>
        <div className="flex items-center space-x-2">
          {project.manager?.avatar ? (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {project.manager.avatar}
            </div>
          ) : null}
          <span>{project.projectManager || (project.manager?.name || 'Not assigned')}</span>
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">Risk</h2>
        {getRiskBadge(project.riskLevel || 'medium')}
      </div>
    </div>
  );
};

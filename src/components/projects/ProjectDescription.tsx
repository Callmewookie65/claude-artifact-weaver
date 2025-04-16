
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ProjectData } from '@/types/project';
import { Database } from 'lucide-react';

interface ProjectDescriptionProps {
  project: ProjectData;
}

export const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ project }) => {
  const isImportedFromConfluence = project.description && project.description.includes("imported from Confluence");
  
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle className="text-xl font-semibold">Project Description</CardTitle>
        {isImportedFromConfluence && (
          <div className="flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
            <Database className="h-3 w-3 mr-1" /> 
            <span>Imported from Confluence</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {project.description ? (
          <div className="prose max-w-none">
            {project.description.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No description provided</p>
        )}
      </CardContent>
    </Card>
  );
};

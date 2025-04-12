
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ProjectData } from './ProjectCSVImport';

interface ProjectDescriptionProps {
  project: ProjectData;
}

export const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ project }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{project.description || 'No description provided'}</p>
      </CardContent>
    </Card>
  );
};

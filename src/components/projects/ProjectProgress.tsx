import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ProjectData } from '@/types/project';

interface ProjectProgressProps {
  project: ProjectData;
}

export const ProjectProgress: React.FC<ProjectProgressProps> = ({ project }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">Total progress</span>
            <span className="text-sm font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
        {project.hoursWorked && project.estimatedTime && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Hours worked:</span>
            <span className="font-medium">{project.hoursWorked} / {project.estimatedTime}</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Start date</p>
            <p className="font-medium">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">End date</p>
            <p className="font-medium">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

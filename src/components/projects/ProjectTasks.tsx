import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProjectData } from '@/types/project';

interface ProjectTasksProps {
  project: ProjectData;
}

export const ProjectTasks: React.FC<ProjectTasksProps> = ({ project }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Project tasks and assignments</CardDescription>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        <p>Task management feature will be implemented here.</p>
      </CardContent>
    </Card>
  );
};


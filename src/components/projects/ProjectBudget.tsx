
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ProjectData } from './ProjectCSVImport';

interface ProjectBudgetProps {
  project: ProjectData;
}

export const ProjectBudget: React.FC<ProjectBudgetProps> = ({ project }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {project.budget ? (
          <>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Budget utilization</span>
                <span className="text-sm font-medium">{Math.round((project.budget.used / project.budget.total) * 100)}%</span>
              </div>
              <Progress value={Math.round((project.budget.used / project.budget.total) * 100)} className="h-2" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {project.budget.used.toLocaleString()} / {project.budget.total.toLocaleString()} PLN
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Remaining budget</p>
                <p className="font-medium">{(project.budget.total - project.budget.used).toLocaleString()} PLN</p>
              </div>
              {project.margin && (
                <div>
                  <p className="text-sm text-muted-foreground">Margin</p>
                  <p className="font-medium text-green-600">{project.margin}%</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">No budget information available</p>
        )}
      </CardContent>
    </Card>
  );
};

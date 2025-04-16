
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProjectData } from '@/types/project';

interface ProjectCardProps {
  project: ProjectData;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Format budget as percentage
  const getBudgetPercentage = (used: number, total: number) => {
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  // Get risk badge
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'low': return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      case 'medium': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'high': return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'completed': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      case 'onHold': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">On Hold</Badge>;
      case 'atRisk': return <Badge className="bg-red-100 text-red-800 border-red-200">At Risk</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription>{project.client}</CardDescription>
          </div>
          {getStatusBadge(project.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {project.projectManager && (
          <div className="text-sm text-muted-foreground">
            Manager: {project.projectManager}
          </div>
        )}
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
        
        {project.budget && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Budget</span>
              <span className="text-sm font-medium">
                {getBudgetPercentage(project.budget.used, project.budget.total)}%
              </span>
            </div>
            <Progress 
              value={getBudgetPercentage(project.budget.used, project.budget.total)} 
              className={`h-2 ${getBudgetPercentage(project.budget.used, project.budget.total) > 90 ? 'bg-red-200' : ''}`} 
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                {project.budget.used.toLocaleString()} / {project.budget.total.toLocaleString()} PLN
              </span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-3 text-xs text-muted-foreground">
          <div className="flex flex-col">
            <span>Risk</span>
            <span className="font-medium text-foreground">{getRiskBadge(project.riskLevel || 'medium')}</span>
          </div>
          {project.hoursWorked && project.estimatedTime && (
            <div className="flex flex-col">
              <span>Hours</span>
              <span className="font-medium text-foreground">
                {project.hoursWorked} / {project.estimatedTime}
              </span>
            </div>
          )}
          {project.margin && (
            <div className="flex flex-col">
              <span>Margin</span>
              <span className="font-medium text-foreground">{project.margin}%</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 text-xs text-muted-foreground">
          {project.startDate && (
            <div className="flex flex-col">
              <span>Start</span>
              <span className="font-medium text-foreground">
                {new Date(project.startDate).toLocaleDateString()}
              </span>
            </div>
          )}
          {project.endDate && (
            <div className="flex flex-col">
              <span>End</span>
              <span className="font-medium text-foreground">
                {new Date(project.endDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        
        {project.lastActivity && (
          <div className="text-xs text-muted-foreground">
            Last activity: {new Date(project.lastActivity).toLocaleString()}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to={`/projects/${project.id}`}>View Project</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

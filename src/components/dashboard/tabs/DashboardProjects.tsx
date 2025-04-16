
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { ProjectData } from '@/types/project';
import { Badge } from '@/components/ui/badge';

interface DashboardProjectsProps {
  projects: ProjectData[];
  sortBy: string;
}

export const DashboardProjects: React.FC<DashboardProjectsProps> = ({ projects, sortBy }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'onHold': return 'bg-yellow-500';
      case 'atRisk': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktywny';
      case 'completed': return 'Zakończony';
      case 'onHold': return 'Wstrzymany';
      case 'atRisk': return 'Zagrożony';
      default: return status;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'low': return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Niskie</Badge>;
      case 'medium': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Średnie</Badge>;
      case 'high': return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Wysokie</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getBudgetPercentage = (used: number, total: number) => {
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  const getSortedProjects = () => {
    return [...projects].sort((a, b) => {
      if (sortBy === 'status') {
        const statusOrder: Record<string, number> = { atRisk: 0, onHold: 1, active: 2, completed: 3 };
        return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
      } else if (sortBy === 'risk') {
        const riskOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
        return (riskOrder[a.riskLevel || ''] || 3) - (riskOrder[b.riskLevel || ''] || 3);
      } else if (sortBy === 'budget') {
        const aPercentage = a.budget ? (a.budget.used / a.budget.total) * 100 : 0;
        const bPercentage = b.budget ? (b.budget.used / b.budget.total) * 100 : 0;
        return bPercentage - aPercentage;
      } else {
        return (a.name || '').localeCompare(b.name || '');
      }
    });
  };
  
  const sortedProjects = getSortedProjects();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProjects.slice(0, 6).map(project => (
          <Card key={project.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>{project.client}</CardDescription>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </div>
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
                  <span className="text-sm text-muted-foreground">Postęp</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              
              {project.budget && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Budżet</span>
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
                  <span>Ryzyko</span>
                  <span className="font-medium text-foreground">{getRiskBadge(project.riskLevel || 'medium')}</span>
                </div>
                {project.hoursWorked && project.estimatedTime && (
                  <div className="flex flex-col">
                    <span>Godziny</span>
                    <span className="font-medium text-foreground">
                      {project.hoursWorked} / {project.estimatedTime}
                    </span>
                  </div>
                )}
                {project.margin && (
                  <div className="flex flex-col">
                    <span>Marża</span>
                    <span className="font-medium text-foreground">{project.margin}%</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to={`/projects/${project.id}`}>
                  Szczegóły projektu
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {projects.length > 6 && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" asChild>
            <Link to="/projects">Zobacz wszystkie projekty ({projects.length})</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

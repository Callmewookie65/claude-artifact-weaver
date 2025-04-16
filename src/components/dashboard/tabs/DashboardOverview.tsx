import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ProjectData } from '@/types/project';

interface DashboardOverviewProps {
  projects: ProjectData[];
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ projects }) => {
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

  const getBudgetPercentage = (used: number, total: number) => {
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Projekty zagrożone</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects
          .filter(project => project.status === 'atRisk' || project.riskLevel === 'high')
          .slice(0, 4)
          .map(project => (
            <Card key={project.id} className="border-red-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
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
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to={`/projects/${project.id}`}>
                    Szczegóły projektu
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        }
        {projects.filter(project => project.status === 'atRisk' || project.riskLevel === 'high').length === 0 && (
          <div className="col-span-2 p-6 text-center border border-dashed rounded-lg">
            <p className="text-muted-foreground">Brak projektów zagrożonych</p>
          </div>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ostatnia aktywność</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Avatar className="mt-1">
                <AvatarFallback>JK</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">Jan Kowalski dodał komentarz do projektu <span className="font-semibold">Aplikacja Mobilna</span></p>
                <p className="text-sm text-muted-foreground">
                  "Klient zatwierdził makiety. Możemy przejść do następnego etapu."
                </p>
                <p className="text-xs text-muted-foreground">2 godziny temu</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Avatar className="mt-1">
                <AvatarFallback>AN</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">Anna Nowak zaktualizowała status zadania <span className="font-semibold">Implementacja frontendu</span></p>
                <p className="text-sm">
                  Status zmieniony z <Badge variant="outline" className="mr-1">Do zrobienia</Badge> 
                  na <Badge variant="outline" className="bg-blue-100 border-blue-200 text-blue-800">W trakcie</Badge>
                </p>
                <p className="text-xs text-muted-foreground">4 godziny temu</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Avatar className="mt-1">
                <AvatarFallback>PW</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">Piotr Wiśniewski dodał nowe ryzyko do projektu <span className="font-semibold">System CRM</span></p>
                <p className="text-sm text-muted-foreground">
                  "Przekroczenie budżetu - Ze względu na złożoność migracji istnieje ryzyko przekroczenia budżetu"
                </p>
                <p className="text-xs text-muted-foreground">Wczoraj, 16:45</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full">
            Zobacz więcej aktywności
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};


import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { ProjectData } from '@/components/projects/ProjectCSVImport';

interface DashboardStatsProps {
  projects: ProjectData[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ projects }) => {
  // Calculate project stats
  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    atRisk: projects.filter(p => p.status === 'atRisk').length,
    onHold: projects.filter(p => p.status === 'onHold').length,
  };

  // Calculate budget stats
  const budgetStats = {
    totalBudget: projects.reduce((sum, p) => sum + (p.budget?.total || 0), 0),
    usedBudget: projects.reduce((sum, p) => sum + (p.budget?.used || 0), 0),
    averageUsagePercentage: projects.length > 0 
      ? Math.round(projects.reduce((sum, p) => {
          if (p.budget?.total) {
            return sum + ((p.budget.used / p.budget.total) * 100);
          }
          return sum;
        }, 0) / projects.filter(p => p.budget?.total).length)
      : 0,
    projectsNearBudget: projects.filter(p => {
      if (p.budget?.total) {
        return (p.budget.used / p.budget.total) > 0.9;
      }
      return false;
    }).length,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Projekty</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projectStats.total}</div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col items-center">
              <span className="bg-green-100 text-green-800 p-1 rounded-full w-6 h-6 flex items-center justify-center font-medium">
                {projectStats.active}
              </span>
              <span className="mt-1 text-muted-foreground">Aktywne</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-red-100 text-red-800 p-1 rounded-full w-6 h-6 flex items-center justify-center font-medium">
                {projectStats.atRisk}
              </span>
              <span className="mt-1 text-muted-foreground">Zagrożone</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="ghost" size="sm" className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            {projectStats.completed} zakończonych w tym roku
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Zadania</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">44</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="flex flex-col items-center">
              <span className="bg-orange-100 text-orange-800 p-1 rounded-full w-6 h-6 flex items-center justify-center font-medium">
                12
              </span>
              <span className="mt-1 text-muted-foreground">Do zrobienia</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-blue-100 text-blue-800 p-1 rounded-full w-6 h-6 flex items-center justify-center font-medium">
                8
              </span>
              <span className="mt-1 text-muted-foreground">W trakcie</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-green-100 text-green-800 p-1 rounded-full w-6 h-6 flex items-center justify-center font-medium">
                24
              </span>
              <span className="mt-1 text-muted-foreground">Ukończone</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="ghost" size="sm" className="w-full">
            <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
            3 zadania po terminie
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Wykorzystanie Budżetu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-1">
            <span className="text-2xl font-bold">{budgetStats.averageUsagePercentage}%</span>
            <span className="text-sm text-yellow-500">+5%</span>
          </div>
          <Progress value={budgetStats.averageUsagePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Średnie wykorzystanie budżetu dla wszystkich projektów
          </p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="ghost" size="sm" className="w-full">
            <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
            {budgetStats.projectsNearBudget} projekty powyżej 90% budżetu
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Nadchodzące terminy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7</div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center border-l-4 border-blue-500 pl-2">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <div className="flex-1">
                <p className="text-xs font-medium">Przegląd projektu</p>
                <p className="text-xs text-muted-foreground">Za 2 dni</p>
              </div>
            </div>
            <div className="flex items-center border-l-4 border-red-500 pl-2">
              <Clock className="h-4 w-4 mr-2 text-red-500" />
              <div className="flex-1">
                <p className="text-xs font-medium">Deadline MVP</p>
                <p className="text-xs text-muted-foreground">Za 5 dni</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="ghost" size="sm" className="w-full">
            <Calendar className="mr-2 h-4 w-4" />
            Zobacz kalendarz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

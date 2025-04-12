import React, { useState, useContext, createContext, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { AlertTriangle, CheckCircle, Clock, ArrowUpRight, Calendar, Users, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from "@/hooks/use-toast";
import { ProjectData } from '@/components/projects/ProjectCSVImport';
import { Link } from 'react-router-dom';

export const ProjectsContext = createContext<{
  projects: ProjectData[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectData[]>>;
}>({
  projects: [],
  setProjects: () => {},
});

export const ProjectsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectData[]>([
    {
      id: '101',
      name: 'Redesign Strony Głównej',
      client: 'Acme Corp',
      status: 'active',
      progress: 45,
      budget: { used: 25000, total: 50000 },
      riskLevel: 'medium',
      startDate: '2025-01-15',
      endDate: '2025-06-30',
      projectManager: 'John Doe',
      hoursWorked: 100,
      estimatedTime: 150,
      margin: 20,
    },
    {
      id: '102',
      name: 'Aplikacja Mobilna',
      client: 'XYZ Ltd',
      status: 'active',
      progress: 20,
      budget: { used: 12000, total: 100000 },
      riskLevel: 'low',
      startDate: '2025-02-01',
      endDate: '2025-08-31',
      projectManager: 'Jane Smith',
      hoursWorked: 80,
      estimatedTime: 120,
      margin: 15,
    },
    {
      id: '103',
      name: 'System CRM',
      client: 'Best Company',
      status: 'atRisk',
      progress: 65,
      budget: { used: 88000, total: 90000 },
      riskLevel: 'high',
      startDate: '2025-01-01',
      endDate: '2025-05-15',
      projectManager: 'Emily Johnson',
      hoursWorked: 120,
      estimatedTime: 180,
      margin: 25,
    }
  ]);
  
  return (
    <ProjectsContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};

const Dashboard = () => {
  const { projects } = useContext(ProjectsContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [sortBy, setSortBy] = useState('status');

  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    atRisk: projects.filter(p => p.status === 'atRisk').length,
    onHold: projects.filter(p => p.status === 'onHold').length,
  };

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

  const projectStatusData = [
    { name: 'Aktywne', value: projectStats.active },
    { name: 'Zakończone', value: projectStats.completed },
    { name: 'Wstrzymane', value: projectStats.onHold },
    { name: 'Zagrożone', value: projectStats.atRisk },
  ].filter(item => item.value > 0);

  const budgetData = projects
    .filter(p => p.budget?.total)
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      planned: p.budget?.total || 0,
      used: p.budget?.used || 0
    }));

  const tasksData = [
    { name: 'Do zrobienia', value: 12 },
    { name: 'W trakcie', value: 8 },
    { name: 'Ukończone', value: 24 },
  ];

  const progressTrendData = [
    { month: 'Sty', value: 20 },
    { month: 'Lut', value: 35 },
    { month: 'Mar', value: 50 },
    { month: 'Kwi', value: 65 },
    { month: 'Maj', value: 82 },
  ];

  const statusColors = ['#4ade80', '#60a5fa', '#f59e0b', '#f87171'];
  const taskColors = ['#f97316', '#3b82f6', '#22c55e'];

  const getBudgetPercentage = (used: number, total: number) => {
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

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

  const handleExportReport = () => {
    toast({
      title: "Eksport raportu",
      description: "Raport zostanie wysłany na Twój email",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard Projektów</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <select 
            className="bg-background border rounded px-3 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="status">Sortuj wg. Statusu</option>
            <option value="risk">Sortuj wg. Ryzyka</option>
            <option value="budget">Sortuj wg. Budżetu</option>
            <option value="name">Sortuj wg. Nazwy</option>
          </select>
          <Button asChild>
            <Link to="/projects">
              <Briefcase className="mr-2 h-4 w-4" />
              View All Projects
            </Link>
          </Button>
        </div>
      </div>

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

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Przegląd</TabsTrigger>
          <TabsTrigger value="projects">Projekty</TabsTrigger>
          <TabsTrigger value="analytics">Analityka</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
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
          </div>

          <Card>
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
        </TabsContent>

        <TabsContent value="projects" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getSortedProjects().slice(0, 6).map(project => (
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status projektów</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {projectStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wykorzystanie budżetu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={budgetData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => `${value.toLocaleString()} PLN`} />
                      <Bar dataKey="planned" fill="#8884d8" name="Planowany" />
                      <Bar dataKey="used" fill="#82ca9d" name="Wykorzystany" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status zadań</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tasksData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {tasksData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={taskColors[index % taskColors.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trend postępu projektów</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={progressTrendData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => `${value}%`} />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Średni postęp" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Nadchodzące terminy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex-1">
                <p className="font-medium">Przegląd projektu - Redesign Strony Głównej</p>
                <p className="text-sm text-muted-foreground">Spotkanie z klientem w celu omówienia postępów prac.</p>
              </div>
              <div className="text-right">
                <p className="font-medium">13.04.2025</p>
                <p className="text-sm text-muted-foreground">Za 2 dni</p>
              </div>
            </div>
            
            <div className="flex items-center border-l-4 border-red-500 pl-4 py-2">
              <div className="flex-1">
                <p className="font-medium">Deadline MVP - Aplikacja Mobilna</p>
                <p className="text-sm text-muted-foreground">Termin dostarczenia pierwszej wersji aplikacji.</p>
              </div>
              <div className="text-right">
                <p className="font-medium">16.04.2025</p>
                <p className="text-sm text-muted-foreground">Za 5 dni</p>
              </div>
            </div>
            
            <div className="flex items-center border-l-4 border-yellow-500 pl-4 py-2">
              <div className="flex-1">
                <p className="font-medium">Migracja danych - System CRM</p>
                <p className="text-sm text-muted-foreground">Przeniesienie danych klienta do nowego systemu.</p>
              </div>
              <div className="text-right">
                <p className="font-medium">20.04.2025</p>
                <p className="text-sm text-muted-foreground">Za 9 dni</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            Zobacz wszystkie terminy
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Zespół projektowy</CardTitle>
          <Button size="sm">
            <Users className="h-4 w-4 mr-2" />
            Dodaj osobę
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg flex items-center space-x-3 dark:border-gray-700">
              <Avatar className="h-12 w-12">
                <AvatarFallback>JK</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Jan Kowalski</p>
                <p className="text-sm text-muted-foreground">Project Manager</p>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg flex items-center space-x-3 dark:border-gray-700">
              <Avatar className="h-12 w-12">
                <AvatarFallback>AN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Anna Nowak</p>
                <p className="text-sm text-muted-foreground">Designer</p>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg flex items-center space-x-3 dark:border-gray-700">
              <Avatar className="h-12 w-12">
                <AvatarFallback>PW</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Piotr Wiśniewski</p>
                <p className="text-sm text-muted-foreground">Developer</p>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg flex items-center space-x-3 dark:border-gray-700">
              <Avatar className="h-12 w-12">
                <AvatarFallback>ML</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Marta Lewandowska</p>
                <p className="text-sm text-muted-foreground">Content Manager</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

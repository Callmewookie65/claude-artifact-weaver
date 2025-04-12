import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, FileText, Users, AlertTriangle, Settings, Edit, Activity } from 'lucide-react';
import { ProjectCSVImport, ProjectData } from '@/components/projects/ProjectCSVImport';
import { toast } from "@/hooks/use-toast";
import { ProjectsContext } from '@/pages/Dashboard';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { projects, setProjects } = useContext(ProjectsContext);
  
  const [project, setProject] = useState<ProjectData | null>(null);
  
  useEffect(() => {
    const foundProject = projects.find(p => p.id === id);
    
    if (foundProject) {
      setProject(foundProject);
    } else {
      setProject({
        id,
        name: 'Redesign Strony Głównej',
        client: 'Acme Corp',
        status: 'active',
        description: "Complete redesign of the client's main website, including modernization of UI, UX improvements, and SEO optimization.",
        progress: 45,
        budget: { used: 25000, total: 50000 },
        riskLevel: 'medium',
        startDate: '2025-01-15',
        endDate: '2025-06-30',
        manager: {
          id: '1',
          name: 'Jan Kowalski',
          avatar: 'JK'
        },
        team: [
          { id: '2', name: 'Anna Nowak', role: 'Designer', avatar: 'AN' },
          { id: '3', name: 'Piotr Wiśniewski', role: 'Developer', avatar: 'PW' },
          { id: '4', name: 'Marta Lewandowska', role: 'Content Manager', avatar: 'ML' }
        ]
      });
    }
  }, [id, projects]);
  
  const handleImportCSV = (data: ProjectData[]) => {
    const importedProject = data.find(p => p.id === id) || data[0];
    
    if (!importedProject) {
      toast({
        title: "Import Error",
        description: "No matching project found in the CSV data",
        variant: "destructive"
      });
      return;
    }
    
    setProject(prev => {
      if (!prev) return importedProject;
      
      const updated = {
        ...prev,
        ...importedProject,
        team: prev.team,
        manager: prev.manager
      };
      
      setProjects(prevProjects => 
        prevProjects.map(p => p.id === id ? updated : p)
      );
      
      return updated;
    });

    toast({
      title: "Project Updated",
      description: `Project "${importedProject.name}" has been updated successfully.`,
    });
  };
  
  const handleDownloadTemplate = () => {
    if (!project) return;
    
    const headers = "name,client,status,projectManager,progress,budget,riskLevel,startDate,endDate,hoursWorked,estimatedTime,margin,id\n";
    
    const budget = project.budget ? 
      JSON.stringify(project.budget).replace(/"/g, '""') : 
      '{"used":0,"total":0}';
    
    const row = [
      `"${project.name}"`,
      `"${project.client}"`,
      `"${project.status}"`,
      `"${project.projectManager || ''}"`,
      project.progress || 0,
      `"${budget}"`,
      `"${project.riskLevel || 'medium'}"`,
      `"${project.startDate || ''}"`,
      `"${project.endDate || ''}"`,
      project.hoursWorked || '',
      project.estimatedTime || '',
      project.margin || '',
      `"${project.id}"`,
    ].join(',');
    
    const csvContent = `${headers}${row}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `project-${project.id}-export.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Template Downloaded",
      description: "You can update this file and import it back to update the project"
    });
  };
  
  if (!project) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Loading project...</h2>
          <p className="text-muted-foreground">Please wait while we load your project data.</p>
        </div>
      </div>
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed': return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'onHold': return <Badge className="bg-yellow-100 text-yellow-800">On Hold</Badge>;
      case 'atRisk': return <Badge className="bg-red-100 text-red-800">At Risk</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };
  
  const getRiskBadge = (level: string) => {
    switch(level) {
      case 'low': return <Badge variant="outline" className="bg-green-100 text-green-800">Low</Badge>;
      case 'medium': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'high': return <Badge variant="outline" className="bg-red-100 text-red-800">High</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {getStatusBadge(project.status)}
        </div>
        <div className="flex space-x-2">
          <ProjectCSVImport 
            onImport={handleImportCSV}
            onDownloadTemplate={handleDownloadTemplate}
          />
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button>
            <Activity className="h-4 w-4 mr-2" />
            Actions
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Client</h2>
          <p>{project.client}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Project Manager</h2>
          <div className="flex items-center space-x-2">
            {project.manager?.avatar ? (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                {project.manager.avatar}
              </div>
            ) : null}
            <span>{project.projectManager || project.manager?.name || 'Not assigned'}</span>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Risk</h2>
          {getRiskBadge(project.riskLevel || 'medium')}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{project.description || 'No description provided'}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Manage project tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Task management feature will be implemented here.</p>
            </CardContent>
            <CardFooter>
              <Button>Create Task</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="risks" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Risks</CardTitle>
                <CardDescription>Manage project risks</CardDescription>
              </div>
              <Button>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Add Risk
              </Button>
            </CardHeader>
            <CardContent>
              <p>Risk management feature will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team</CardTitle>
                <CardDescription>Project team members</CardDescription>
              </div>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.team?.map(member => (
                  <div key={member.id} className="p-4 border border-gray-200 rounded-lg flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
                {(!project.team || project.team.length === 0) && (
                  <div className="col-span-3 text-center p-4 border border-dashed rounded">
                    <p className="text-muted-foreground">No team members assigned</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Project documentation</CardDescription>
              </div>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </CardHeader>
            <CardContent>
              <p>Document management feature will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>Manage project settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Project settings will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, FileText, Users, AlertTriangle, Settings, Edit, Activity } from 'lucide-react';
import { ImportCSVDialog } from '@/components/projects/ImportCSVDialog';
import { toast } from "@/hooks/use-toast";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock project data - in a real app, this would be fetched from an API
  const [project, setProject] = useState({
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
  
  // Handle updating project data from CSV import
  const handleImportCSV = (data: Record<string, any>) => {
    setProject(prev => ({
      ...prev,
      ...data,
      // Preserve team and manager data if not provided in CSV
      team: data.team || prev.team,
      manager: data.manager || prev.manager,
      // Ensure id remains the same
      id: prev.id
    }));

    toast({
      title: "Project Updated",
      description: `Project "${data.name}" has been updated successfully.`,
    });
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed': return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'onHold': return <Badge className="bg-yellow-100 text-yellow-800">On Hold</Badge>;
      case 'atRisk': return <Badge className="bg-red-100 text-red-800">At Risk</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };
  
  // Get risk level badge
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
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {getStatusBadge(project.status)}
        </div>
        <div className="flex space-x-2">
          <ImportCSVDialog onImport={handleImportCSV} />
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
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {project.manager.avatar}
            </div>
            <span>{project.manager.name}</span>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Risk</h2>
          {getRiskBadge(project.riskLevel)}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Start date</p>
                <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End date</p>
                <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <div>
                <p className="text-sm text-muted-foreground">Deviation</p>
                <p className="font-medium text-green-600">On track</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tab navigation */}
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
              <p>{project.description}</p>
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
                {project.team.map(member => (
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

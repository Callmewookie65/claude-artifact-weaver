
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, FileText, Users, Calendar, Settings, BarChart } from 'lucide-react';
import { ProjectDescription } from './ProjectDescription';
import { ProjectTeam } from './ProjectTeam';
import { ProjectDashboard } from './ProjectDashboard';
import { ProjectData } from './ProjectCSVImport';

interface ProjectTabsProps {
  project: ProjectData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ProjectTabs: React.FC<ProjectTabsProps> = ({ project, activeTab, setActiveTab }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="risks">Risks</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="mt-6">
        <ProjectDescription project={project} />
      </TabsContent>
      
      <TabsContent value="dashboard" className="mt-6">
        <ProjectDashboard project={project} />
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
        <ProjectTeam project={project} />
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
  );
};

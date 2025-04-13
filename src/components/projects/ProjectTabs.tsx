
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, FileText, Users, Calendar, Settings, BarChart,
  Download, Printer, PencilIcon, ArrowUpRight 
} from 'lucide-react';
import { ProjectDescription } from './ProjectDescription';
import { ProjectTeam } from './ProjectTeam';
import { ProjectRisks } from './ProjectRisks';
import { ProjectTasks } from './ProjectTasks';
import { ProjectDashboard } from './ProjectDashboard';
import { ProjectData } from './ProjectCSVImport';
import { Link } from 'react-router-dom';

interface ProjectTabsProps {
  project: ProjectData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ProjectTabs: React.FC<ProjectTabsProps> = ({ project, activeTab, setActiveTab }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-7 w-full max-w-4xl mb-2">
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
        <ProjectTasks project={project} />
      </TabsContent>
      
      <TabsContent value="risks" className="mt-6">
        <ProjectRisks project={project} />
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

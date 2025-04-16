
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectData } from '@/types/project';
import { DashboardOverview } from './tabs/DashboardOverview';
import { DashboardProjects } from './tabs/DashboardProjects';
import { DashboardAnalytics } from './tabs/DashboardAnalytics';

interface DashboardTabsProps {
  projects: ProjectData[];
  sortBy: string;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({ projects, sortBy }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="overview">Przegląd</TabsTrigger>
        <TabsTrigger value="projects">Projekty</TabsTrigger>
        <TabsTrigger value="analytics">Analityka</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6 mt-6">
        <DashboardOverview projects={projects} />
      </TabsContent>

      <TabsContent value="projects" className="space-y-6 mt-6">
        <DashboardProjects projects={projects} sortBy={sortBy} />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6 mt-6">
        <DashboardAnalytics projects={projects} />
      </TabsContent>
    </Tabs>
  );
};

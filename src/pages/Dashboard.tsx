
import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { ProjectsContext } from '@/components/providers/ProjectsProvider';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { DashboardDeadlines } from '@/components/dashboard/DashboardDeadlines';
import { DashboardTeam } from '@/components/dashboard/DashboardTeam';

const Dashboard = () => {
  const { projects } = useContext(ProjectsContext);
  const [sortBy, setSortBy] = useState('status');

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

      <DashboardStats projects={projects} />
      <DashboardTabs projects={projects} sortBy={sortBy} />
      <DashboardDeadlines />
      <DashboardTeam />
    </div>
  );
};

export default Dashboard;

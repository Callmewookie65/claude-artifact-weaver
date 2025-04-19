import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Briefcase, FileUp } from 'lucide-react';
import { ProjectsContext } from '@/components/providers/ProjectsProvider';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { DashboardDeadlines } from '@/components/dashboard/DashboardDeadlines';
import { DashboardTeam } from '@/components/dashboard/DashboardTeam';
import { BudgetCSVImport } from '@/components/projects/BudgetCSVImport';
import { generateBudgetTemplate, updateProjectBudgets } from '@/utils/csvExport';
import { toast } from '@/hooks/use-toast';
import { AIImportSection } from '@/components/dashboard/AIImportSection';

const Dashboard = () => {
  const { projects, setProjects } = useContext(ProjectsContext);
  const [sortBy, setSortBy] = useState('status');

  // Handle budget import
  const handleBudgetImport = (budgetMap: Record<string, { used: number; total: number }>) => {
    const updatedProjects = updateProjectBudgets(projects, budgetMap);
    setProjects(updatedProjects);
    
    toast({
      title: "Budgets Updated",
      description: `Budget information updated for ${Object.keys(budgetMap).length} projects`
    });
  };
  
  // Handle budget template download
  const handleDownloadBudgetTemplate = () => {
    generateBudgetTemplate();
    
    toast({
      title: "Budget Template Downloaded",
      description: "Fill the template with budget data and import it back"
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold bg-gradient-custom">Project Dashboard</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <select 
            className="bg-white border border-[#eee] rounded-lg px-3 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="status">Sort by Status</option>
            <option value="risk">Sort by Risk</option>
            <option value="budget">Sort by Budget</option>
            <option value="name">Sort by Name</option>
          </select>
          <BudgetCSVImport 
            onImport={handleBudgetImport}
            onDownloadTemplate={handleDownloadBudgetTemplate}
          />
          <Button asChild className="bg-black text-white hover:bg-black/90">
            <Link to="/projects">
              <Briefcase className="mr-2 h-4 w-4" />
              View All Projects
            </Link>
          </Button>
        </div>
      </div>

      <AIImportSection />

      <DashboardStats projects={projects} />
      <DashboardTabs projects={projects} sortBy={sortBy} />
      <DashboardDeadlines />
      <DashboardTeam />
    </div>
  );
};

export default Dashboard;

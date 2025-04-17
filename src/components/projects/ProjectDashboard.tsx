
import React from 'react';
import { ProjectData } from '@/types/project';
import { useProjectDashboard } from './dashboard/useProjectDashboard';
import { ProjectDashboardHeader } from './dashboard/ProjectDashboardHeader';
import { KeyMetrics } from './dashboard/KeyMetrics';
import { BudgetChart } from './dashboard/BudgetChart';
import { ProgressChart } from './dashboard/ProgressChart';
import { ResourceAllocationChart } from './dashboard/ResourceAllocationChart';
import { RiskAssessment } from './dashboard/RiskAssessment';
import { DashboardFooter } from './dashboard/DashboardFooter';

interface ProjectDashboardProps {
  project: ProjectData;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ project }) => {
  const { 
    dashboardRef,
    budgetData,
    progressData,
    resourceData,
    COLORS,
    calculateRemainingDays,
    exportToPDF,
    exportToPNG,
    exportChartDataCSV
  } = useProjectDashboard(project);

  return (
    <div className="space-y-8">
      <ProjectDashboardHeader 
        project={project} 
        exportToPNG={exportToPNG}
        exportToPDF={exportToPDF}
      />
      
      <div ref={dashboardRef} className="space-y-12 p-6 rounded-lg bg-gray-50 dark:bg-gray-900/40 backdrop-blur-sm border border-white/10 shadow-lg">
        {/* Key Metrics */}
        <KeyMetrics 
          project={project} 
          calculateRemainingDays={calculateRemainingDays} 
        />
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Budget Chart */}
          <BudgetChart 
            budgetData={budgetData} 
            exportChartDataCSV={exportChartDataCSV} 
          />
          
          {/* Progress Timeline */}
          <ProgressChart 
            progressData={progressData} 
            exportChartDataCSV={exportChartDataCSV} 
          />
        </div>
        
        {/* Resource Allocation - Full Width */}
        <div className="mt-10">
          <ResourceAllocationChart 
            resourceData={resourceData} 
            COLORS={COLORS} 
            exportChartDataCSV={exportChartDataCSV} 
          />
        </div>
        
        {/* Project Risk Details - Full Width with extra margin */}
        <div className="mt-12 pt-4">
          <RiskAssessment project={project} />
        </div>
        
        <DashboardFooter />
      </div>
    </div>
  );
};

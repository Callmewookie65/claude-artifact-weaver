
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, Clock, Users } from 'lucide-react';
import { ProjectData } from '@/types/project';

interface KeyMetricsProps {
  project: ProjectData;
  calculateRemainingDays: () => string;
}

export const KeyMetrics: React.FC<KeyMetricsProps> = ({ project, calculateRemainingDays }) => {
  const getBudgetPercentage = () => {
    return project.budget ? 
      Math.round((project.budget.used / project.budget.total) * 100) : 
      'N/A';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="hover:shadow-md transition-shadow bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg dark:bg-black/20">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <CardTitle className="text-lg">Time Remaining</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gradient-primary">
            {calculateRemainingDays()}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {project.endDate ? 
              `Due: ${new Date(project.endDate).toLocaleDateString()}` : 
              'No end date set'}
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg dark:bg-black/20">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-400" />
            <CardTitle className="text-lg">Budget Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gradient-primary">
            {project.budget ? 
              `${Math.round((project.budget.used / project.budget.total) * 100)}%` : 
              'N/A'}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {project.budget ? 
              `${project.budget.used.toLocaleString()} / ${project.budget.total.toLocaleString()} PLN` : 
              'No budget data'}
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg dark:bg-black/20">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <CardTitle className="text-lg">Project Progress</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gradient-primary">
            {project.progress || 0}%
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {project.status === 'active' ? 'In Progress' : 
             project.status === 'completed' ? 'Completed' :
             project.status === 'onHold' ? 'On Hold' : 
             project.status === 'atRisk' ? 'At Risk' : project.status}
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg dark:bg-black/20">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-orange-400" />
            <CardTitle className="text-lg">Team Members</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gradient-primary">
            {project.team?.length || 0}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {project.manager?.name ? `Managed by ${project.manager.name}` : 'No manager assigned'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

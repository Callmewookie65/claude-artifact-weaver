
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertTriangle, ArrowUpRight, PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectData } from '@/types/project';

interface RiskAssessmentProps {
  project: ProjectData;
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ project }) => {
  return (
    <Card className="hover:shadow-md transition-shadow bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg dark:bg-black/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <CardTitle className="text-lg">Project Risk Assessment</CardTitle>
          </div>
          <Button variant="outline" size="sm" asChild className="bg-white/5 hover:bg-white/10">
            <a href="#" className="inline-flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Details
            </a>
          </Button>
        </div>
        <CardDescription>
          <span className="flex items-center">
            <span className="text-sm text-muted-foreground">Last assessment: {new Date().toLocaleDateString()}</span>
            <Button variant="link" size="sm" className="p-0 h-auto ml-1">
              <a href="#" className="inline-flex items-center text-xs">
                <PencilIcon className="h-3 w-3 mr-1" />
                Edit
              </a>
            </Button>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${
              project.riskLevel === 'high' ? 'bg-red-400' :
              project.riskLevel === 'medium' ? 'bg-yellow-400' :
              'bg-green-400'
            }`}></div>
            <div>
              <p className="font-medium">Overall Risk Level</p>
              <p className="text-sm text-muted-foreground">
                {project.riskLevel === 'high' ? 'High Risk' :
                 project.riskLevel === 'medium' ? 'Medium Risk' :
                 'Low Risk'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${
              project.budget && project.budget.used > project.budget.total * 0.9 ? 'bg-red-400' :
              project.budget && project.budget.used > project.budget.total * 0.7 ? 'bg-yellow-400' :
              'bg-green-400'
            }`}></div>
            <div>
              <p className="font-medium">Budget Risk</p>
              <p className="text-sm text-muted-foreground">
                {project.budget && project.budget.used > project.budget.total * 0.9 ? 'High Risk' :
                 project.budget && project.budget.used > project.budget.total * 0.7 ? 'Medium Risk' :
                 'Low Risk'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { AlertTriangle, ArrowUpRight, PencilIcon, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectData } from '@/types/project';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface RiskAssessmentProps {
  project: ProjectData;
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ project }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>(project.riskLevel as 'low' | 'medium' | 'high' || 'medium');
  
  const handleSaveRisk = () => {
    // This would connect to the backend in a real implementation
    toast({
      title: "Risk Assessment Updated",
      description: "Risk level has been updated successfully"
    });
    setIsEditing(false);
  };

  return (
    <Card className="hover:shadow-md transition-shadow bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg dark:bg-black/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <CardTitle className="text-lg">Project Risk Assessment</CardTitle>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="bg-white/5 hover:bg-white/10">
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleSaveRisk} className="bg-white/5 hover:bg-white/10">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            )}
            <Button variant="outline" size="sm" asChild className="bg-white/5 hover:bg-white/10">
              <a href="#" className="inline-flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Details
              </a>
            </Button>
          </div>
        </div>
        <CardDescription>
          <span className="flex items-center">
            <span className="text-sm text-muted-foreground">Last assessment: {new Date().toLocaleDateString()}</span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${
              riskLevel === 'high' ? 'bg-red-400' :
              riskLevel === 'medium' ? 'bg-yellow-400' :
              'bg-green-400'
            }`}></div>
            <div>
              <p className="font-medium">Overall Risk Level</p>
              {isEditing ? (
                <Select
                  value={riskLevel}
                  onValueChange={(value: 'low' | 'medium' | 'high') => setRiskLevel(value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {riskLevel === 'high' ? 'High Risk' :
                   riskLevel === 'medium' ? 'Medium Risk' :
                   'Low Risk'}
                </p>
              )}
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
      <CardFooter>
        <Button variant="link" className="px-0" onClick={() => window.alert('Additional risk analysis will be implemented')}>
          View complete risk analysis
        </Button>
      </CardFooter>
    </Card>
  );
};

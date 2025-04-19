
import React, { useContext } from 'react';
import { AIDocumentProcessor } from '@/components/import/AIDocumentProcessor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectData } from '@/types/project';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { Sparkles } from 'lucide-react';
import { ProjectsContext } from '@/components/providers/ProjectsProvider';
import { toast } from '@/hooks/use-toast';

export const AIImportSection: React.FC = () => {
  const { projects } = useContext(ProjectsContext);
  const { 
    handleImportProjects, 
    handleBudgetImport
  } = useProjectManagement();
  
  const handleProjectUpdate = (project: ProjectData) => {
    handleImportProjects([project]);
  };
  
  const handleTasksImport = (tasks: any[]) => {
    console.log('Tasks imported:', tasks);
    // This would typically call a function to import tasks into the system
    // For now we just show a toast since task management is not fully implemented
    
    toast({
      title: "Tasks Imported",
      description: `${tasks.length} tasks have been imported. Task management implementation is in progress.`
    });
  };
  
  return (
    <section className="my-6">
      <h2 className="text-xl font-bold mb-4">AI Document Processing</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Smart Document Import
          </CardTitle>
          <CardDescription>
            Upload any project document and our AI will automatically detect its type and update your project information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-primary-foreground p-4 rounded-lg mb-4">
            <p className="text-sm">
              The AI can process various document formats and intelligently map them to your projects:
            </p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1">
              <li>Project charter documents will update project details</li>
              <li>Budget spreadsheets will update financial information</li>
              <li>Task lists or Jira exports will be added as project tasks</li>
            </ul>
          </div>
          
          <AIDocumentProcessor 
            onProjectUpdate={handleProjectUpdate}
            onBudgetUpdate={handleBudgetImport}
            onTasksImport={handleTasksImport}
            projects={projects}
          />
        </CardContent>
      </Card>
    </section>
  );
};

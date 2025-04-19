
import React, { useState, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectsContext } from '@/components/providers/ProjectsProvider';
import { AIDocumentProcessor } from '@/components/import/AIDocumentProcessor';
import { ProjectData } from '@/types/project';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { FileText, Bot, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function HomePage() {
  const { projects, setProjects } = useContext(ProjectsContext);
  const { handleImportProjects, handleBudgetImport } = useProjectManagement();
  const [queryText, setQueryText] = useState('');
  
  // Handle project update from document import
  const handleProjectUpdate = (project: ProjectData) => {
    handleImportProjects([project]);
  };
  
  // Handle tasks import
  const handleTasksImport = (tasks: any[]) => {
    console.log('Tasks imported:', tasks);
    // This would typically call a function to import tasks into the system
    // For now we just show a toast since task management is not fully implemented
    
    toast({
      title: "Tasks Imported",
      description: `${tasks.length} tasks have been imported. Task management implementation is in progress.`
    });
  };
  
  // Handle project assistant query
  const handleAssistantQuery = () => {
    if (!queryText.trim()) return;
    
    // For now, just show a toast since the AI assistant feature would be implemented later
    toast({
      title: "Project Assistant",
      description: "The AI assistant feature is coming soon. Your query has been received."
    });
    
    setQueryText('');
  };

  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 md:col-start-3 mb-12 space-y-4">
          <h1 className="text-center bg-gradient-custom mb-4 text-3xl font-bold">
            Project Management AI
          </h1>
          <p className="text-center text-muted-foreground max-w-lg mx-auto">
            Upload any project document and our AI will automatically analyze it, extract information, and update your projects.
          </p>
        </div>

        {/* Main document processing card */}
        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Smart Document Processing
            </CardTitle>
            <CardDescription>
              Upload project documents, budgets, task lists, or any other project-related files for automatic processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-primary-foreground p-4 rounded-lg mb-6">
              <p className="text-sm">
                The AI can process various document formats and intelligently map them to your projects:
              </p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li>Project charter documents will update project details</li>
                <li>Budget spreadsheets will update financial information</li>
                <li>Task lists or Jira exports will be added as project tasks</li>
                <li>Resource allocations will update team assignments</li>
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

        {/* Project Assistant */}
        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              Project Assistant
            </CardTitle>
            <CardDescription>
              Ask questions about your projects or request specific information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ask about project status, budgets, deadlines..."
              />
              <Button onClick={handleAssistantQuery}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start text-left">
                <div>
                  <p className="font-medium">Show high-risk projects</p>
                  <p className="text-xs text-muted-foreground">List projects with high risk levels</p>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start text-left">
                <div>
                  <p className="font-medium">Budget status for Project X</p>
                  <p className="text-xs text-muted-foreground">Get detailed budget information</p>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start text-left">
                <div>
                  <p className="font-medium">Tasks due this week</p>
                  <p className="text-xs text-muted-foreground">List upcoming task deadlines</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature highlights */}
        <div className="md:col-span-12 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The system supports popular file formats: CSV, XLSX, JSON, and more. Just upload your files and the AI will extract relevant information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intelligent Mapping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our system automatically maps document fields to the right project attributes, even when column names vary between systems.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View and manage all your projects, tasks, and resources in one place with our comprehensive dashboard.
                </p>
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link to="/dashboard">Go to Dashboard <ArrowRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

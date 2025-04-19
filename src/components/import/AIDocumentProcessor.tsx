
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Check, AlertCircle, Loader2, FileText, Download } from 'lucide-react';
import { 
  DocumentProcessingService,
  DocumentProcessingResult 
} from '@/services/DocumentProcessingService';
import { ProjectData } from '@/types/project';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AIDocumentProcessorProps {
  onProjectUpdate: (project: ProjectData) => void;
  onBudgetUpdate: (budgetMap: Record<string, { used: number; total: number }>) => void;
  onTasksImport: (tasks: any[]) => void;
  projects: ProjectData[];
}

export function AIDocumentProcessor({
  onProjectUpdate,
  onBudgetUpdate,
  onTasksImport,
  projects
}: AIDocumentProcessorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingResult, setProcessingResult] = useState<DocumentProcessingResult | null>(null);
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projectMatches, setProjectMatches] = useState<Array<{projectId: string, name: string, similarity: number}>>([]);
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
  
  // Reset state when processing a new file
  useEffect(() => {
    if (file) {
      setProcessingResult(null);
      setProgress(0);
      setSelectedProjectId('');
      setProjectMatches([]);
      setIsCreatingNewProject(false);
    }
  }, [file]);
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };
  
  // Handle file dropping
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };
  
  // Prevent default behavior for drag events
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  
  // Process the uploaded file
  const processFile = async () => {
    if (!file) return;
    
    try {
      setIsProcessing(true);
      setProgress(10);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) {
            return prev + 10;
          }
          return prev;
        });
      }, 500);
      
      // Process the document
      const result = await DocumentProcessingService.processDocument(file);
      setProcessingResult(result);
      
      setProgress(100);
      clearInterval(progressInterval);
      
      // Find potential project matches
      if (result.documentType !== 'unknown') {
        const { projectMatches } = DocumentProcessingService.matchToExistingProjects(result, projects);
        
        if (projectMatches.length > 0) {
          setProjectMatches(projectMatches);
          setSelectedProjectId(projectMatches[0].projectId);
          setShowMatchDialog(true);
        } else if (result.documentType === 'project' && result.projectData) {
          // If it's a project doc with no matches, create a new project
          handleCreateNewProject();
        } else {
          // For task/budget docs with no matches, prompt user
          setShowMatchDialog(true);
        }
      } else {
        toast({
          title: "Unknown Document Type",
          description: "The system couldn't determine the type of this document.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Failed to process document",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle applying changes to selected project
  const handleApplyToProject = () => {
    if (!processingResult) return;
    
    try {
      if (processingResult.documentType === 'project' && processingResult.projectData) {
        // For project documents, update the selected project
        const existingProject = projects.find(p => p.id === selectedProjectId);
        
        if (existingProject) {
          const updatedProject = {
            ...existingProject,
            ...processingResult.projectData,
            id: existingProject.id // Keep the original ID
          };
          
          onProjectUpdate(updatedProject);
          
          toast({
            title: "Project Updated",
            description: `Updated project: ${existingProject.name}`
          });
        }
      } else if (processingResult.documentType === 'budget' && processingResult.budgetData) {
        // For budget documents, update budgets
        const budgetMap = processingResult.budgetData;
        
        // Update with project ID if needed
        const existingProject = projects.find(p => p.id === selectedProjectId);
        
        if (existingProject && Object.keys(budgetMap).length > 0) {
          // Try to find the budget entry for this project
          const budgetEntry = Object.entries(budgetMap)[0];
          
          // Apply this budget to the selected project
          const updatedBudgetMap = {
            [selectedProjectId]: budgetEntry[1]
          };
          
          onBudgetUpdate(updatedBudgetMap);
          
          toast({
            title: "Budget Updated",
            description: `Updated budget for project: ${existingProject.name}`
          });
        } else {
          onBudgetUpdate(budgetMap);
          
          toast({
            title: "Budgets Updated",
            description: `Updated budgets for ${Object.keys(budgetMap).length} projects`
          });
        }
      } else if (processingResult.documentType === 'task' && processingResult.taskData) {
        // For task documents, import tasks
        let tasks = processingResult.taskData;
        
        // If a project was selected, associate tasks with it
        if (selectedProjectId) {
          const existingProject = projects.find(p => p.id === selectedProjectId);
          if (existingProject) {
            tasks = tasks.map(task => ({
              ...task,
              project: existingProject.name,
              projectId: existingProject.id
            }));
          }
        }
        
        onTasksImport(tasks);
        
        toast({
          title: "Tasks Imported",
          description: `Imported ${tasks.length} tasks`
        });
      }
    } catch (error) {
      console.error("Apply error:", error);
      toast({
        title: "Apply Failed",
        description: error instanceof Error ? error.message : "Failed to apply changes",
        variant: "destructive"
      });
    } finally {
      setShowMatchDialog(false);
      setFile(null);
      setProcessingResult(null);
    }
  };
  
  // Handle creating a new project
  const handleCreateNewProject = () => {
    if (!processingResult || !processingResult.projectData) return;
    
    try {
      // Generate a new ID if not present
      const newProject: ProjectData = {
        ...processingResult.projectData,
        id: processingResult.projectData.id || String(Math.floor(Math.random() * 10000) + 1000),
        status: processingResult.projectData.status || 'active',
        progress: processingResult.projectData.progress || 0,
      } as ProjectData;
      
      onProjectUpdate(newProject);
      
      toast({
        title: "Project Created",
        description: `Created new project: ${newProject.name}`
      });
    } catch (error) {
      console.error("Create project error:", error);
      toast({
        title: "Create Project Failed",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive"
      });
    } finally {
      setShowMatchDialog(false);
      setFile(null);
      setProcessingResult(null);
    }
  };
  
  // Get document type label
  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'project': return 'Project Information';
      case 'task': return 'Task Data';
      case 'budget': return 'Budget Information';
      default: return 'Unknown Document Type';
    }
  };
  
  // Render the result preview based on document type
  const renderResultPreview = () => {
    if (!processingResult) return null;
    
    switch (processingResult.documentType) {
      case 'project':
        return (
          <div className="mt-4 bg-secondary/20 p-4 rounded-md">
            <h3 className="text-lg font-bold">Detected Project Data</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-sm text-muted-foreground">Name:</div>
              <div className="text-sm font-medium">{processingResult.projectData?.name}</div>
              
              <div className="text-sm text-muted-foreground">Client:</div>
              <div className="text-sm font-medium">{processingResult.projectData?.client}</div>
              
              <div className="text-sm text-muted-foreground">Status:</div>
              <div className="text-sm font-medium">{processingResult.projectData?.status}</div>
              
              <div className="text-sm text-muted-foreground">Progress:</div>
              <div className="text-sm font-medium">{processingResult.projectData?.progress}%</div>
              
              {processingResult.projectData?.budget && (
                <>
                  <div className="text-sm text-muted-foreground">Budget Used:</div>
                  <div className="text-sm font-medium">{processingResult.projectData?.budget?.used}</div>
                  
                  <div className="text-sm text-muted-foreground">Budget Total:</div>
                  <div className="text-sm font-medium">{processingResult.projectData?.budget?.total}</div>
                </>
              )}
            </div>
          </div>
        );
        
      case 'task':
        return (
          <div className="mt-4 bg-secondary/20 p-4 rounded-md">
            <h3 className="text-lg font-bold">Detected Tasks</h3>
            <p className="text-sm text-muted-foreground">Found {processingResult.taskData?.length} tasks</p>
            {processingResult.taskData && processingResult.taskData.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium">First Task:</h4>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="text-sm text-muted-foreground">Title:</div>
                  <div className="text-sm font-medium">{processingResult.taskData[0].title}</div>
                  
                  <div className="text-sm text-muted-foreground">Status:</div>
                  <div className="text-sm font-medium">{processingResult.taskData[0].status}</div>
                  
                  <div className="text-sm text-muted-foreground">Priority:</div>
                  <div className="text-sm font-medium">{processingResult.taskData[0].priority}</div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'budget':
        return (
          <div className="mt-4 bg-secondary/20 p-4 rounded-md">
            <h3 className="text-lg font-bold">Detected Budget Data</h3>
            <p className="text-sm text-muted-foreground">
              Found budget information for {processingResult.budgetData ? Object.keys(processingResult.budgetData).length : 0} projects
            </p>
            {processingResult.budgetData && Object.keys(processingResult.budgetData).length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium">First Budget Entry:</h4>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="text-sm text-muted-foreground">Project:</div>
                  <div className="text-sm font-medium">{Object.keys(processingResult.budgetData)[0]}</div>
                  
                  <div className="text-sm text-muted-foreground">Used Budget:</div>
                  <div className="text-sm font-medium">
                    {processingResult.budgetData[Object.keys(processingResult.budgetData)[0]].used}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">Total Budget:</div>
                  <div className="text-sm font-medium">
                    {processingResult.budgetData[Object.keys(processingResult.budgetData)[0]].total}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="mt-4 bg-destructive/20 p-4 rounded-md">
            <h3 className="text-lg font-bold text-destructive">Unknown Document Type</h3>
            <p className="text-sm text-muted-foreground">
              The system couldn't determine the type of this document. Please check the format and try again.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div>
      {/* File upload area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          file ? 'border-primary' : 'border-gray-300'
        } transition-all`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!file && !isProcessing && (
          <>
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Drag and drop your document here</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Support for CSV, JSON, Excel, Text, and Markdown files
            </p>
            <div className="flex justify-center">
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Browse Files
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv,.json,.xlsx,.txt,.md"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </>
        )}
        
        {file && !isProcessing && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-medium">{file.name}</span>
            </div>
            
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setFile(null)}
              >
                Change File
              </Button>
              <Button
                onClick={processFile}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Process with AI
              </Button>
            </div>
          </div>
        )}
        
        {isProcessing && (
          <div className="space-y-4">
            <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" />
            <h3 className="text-lg font-medium">Processing your document...</h3>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground">
              The AI is analyzing your document, extracting information, and determining how to apply it.
            </p>
          </div>
        )}
        
        {processingResult && processingResult.documentType !== 'unknown' && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Check className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-medium">Document Processed Successfully</h3>
              </div>
              
              <div className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                <Sparkles className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  Detected Document Type: <strong>{getDocumentTypeLabel(processingResult.documentType)}</strong>
                </span>
              </div>
              
              {renderResultPreview()}
            </CardContent>
          </Card>
        )}
        
        {processingResult && processingResult.documentType === 'unknown' && (
          <Card className="mt-4 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-medium">Processing Issue</h3>
              </div>
              
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                <p className="text-sm">
                  The system couldn't determine the type of this document. Please check that the document format is supported and try again.
                </p>
              </div>
              
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => setFile(null)}
              >
                Try Different File
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Project match dialog */}
      <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply Document to Project</DialogTitle>
            <DialogDescription>
              {processingResult?.documentType === 'project'
                ? 'This document contains project information. Choose which project to update:'
                : processingResult?.documentType === 'task'
                ? 'This document contains task data. Choose which project these tasks belong to:'
                : 'This document contains budget information. Choose which project to apply it to:'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {projectMatches.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm">Found possible project matches:</p>
                
                <Select
                  value={selectedProjectId}
                  onValueChange={setSelectedProjectId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {projectMatches.map(match => (
                        <SelectItem key={match.projectId} value={match.projectId}>
                          {match.name} ({(match.similarity * 100).toFixed(0)}% match)
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-md">
                <p className="text-sm">
                  No matching projects found. You can create a new project or select an existing one.
                </p>
              </div>
            )}
            
            {processingResult?.documentType === 'project' && (
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingNewProject(true)} 
                  className="w-full"
                >
                  Create as New Project
                </Button>
              </div>
            )}
            
            {(processingResult?.documentType === 'task' || processingResult?.documentType === 'budget') && projectMatches.length === 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Select an existing project:</p>
                <Select
                  value={selectedProjectId}
                  onValueChange={setSelectedProjectId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowMatchDialog(false);
                setFile(null);
                setProcessingResult(null);
              }}
            >
              Cancel
            </Button>
            
            {isCreatingNewProject ? (
              <Button onClick={handleCreateNewProject}>
                Create New Project
              </Button>
            ) : (
              <Button
                disabled={!selectedProjectId && projectMatches.length > 0}
                onClick={handleApplyToProject}
              >
                Apply to Project
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

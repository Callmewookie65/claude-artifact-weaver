
import React, { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileUp, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { ProjectData } from "@/types/project";
import Papa from 'papaparse';
import { processProjectImport, processBudgetImport, updateProjectBudgets } from '@/utils/csvExport';
import { processTasks } from '@/utils/taskImport';

interface AIDocumentProcessorProps {
  onProjectUpdate?: (project: ProjectData) => void;
  onBudgetUpdate?: (budgetMap: Record<string, { used: number; total: number }>) => void;
  onTasksImport?: (tasks: any[]) => void;
}

export const AIDocumentProcessor: React.FC<AIDocumentProcessorProps> = ({ 
  onProjectUpdate, 
  onBudgetUpdate,
  onTasksImport 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const detectDocumentType = async (fileContent: string, fileName: string): Promise<string> => {
    setProcessingStage('Detecting document type...');
    setProgress(30);
    
    // Simple detection logic based on column names or content patterns
    const lowerFileName = fileName.toLowerCase();
    
    if (lowerFileName.includes('budget') || fileContent.includes('budget') || 
        fileContent.includes('spent') || fileContent.includes('remaining')) {
      return 'budget';
    }
    
    if (lowerFileName.includes('jira') || lowerFileName.includes('task') || 
        fileContent.includes('story points') || fileContent.includes('assignee')) {
      return 'tasks';
    }
    
    if (lowerFileName.includes('charter') || lowerFileName.includes('project') || 
        fileContent.includes('objective') || fileContent.includes('scope')) {
      return 'project';
    }
    
    // Default to project if we can't determine
    return 'project';
  };

  const processFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(10);
    setProcessingStage('Reading file...');
    setResult(null);
    
    try {
      const fileText = await file.text();
      const documentType = await detectDocumentType(fileText, file.name);
      
      setProcessingStage(`Processing ${documentType} document...`);
      setProgress(50);
      
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        await processJsonFile(fileText, documentType);
      } else {
        await processCsvFile(fileText, documentType);
      }
      
      setProgress(100);
      setProcessingStage('Processing complete!');
      setResult({ 
        success: true, 
        message: `Successfully processed ${documentType} document and updated project information` 
      });
      
      toast({
        title: "Document Processed Successfully",
        description: `The ${documentType} document has been processed and project information has been updated.`,
      });
    } catch (error) {
      console.error("Error processing document:", error);
      setResult({ 
        success: false, 
        message: `Error processing document: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
      
      toast({
        title: "Error Processing Document",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processCsvFile = async (fileText: string, documentType: string) => {
    return new Promise<void>((resolve, reject) => {
      Papa.parse(fileText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            if (results.data.length === 0) {
              reject(new Error('No data found in the CSV file'));
              return;
            }
            
            setProgress(70);
            
            switch (documentType) {
              case 'budget':
                const budgetMap = processBudgetImport(results.data as any[]);
                if (onBudgetUpdate) {
                  onBudgetUpdate(budgetMap);
                }
                break;
              
              case 'tasks':
                const tasks = processTasks(results.data as any[]);
                if (onTasksImport) {
                  onTasksImport(tasks);
                }
                break;
              
              case 'project':
              default:
                const projects = processProjectImport(results.data as any[]);
                if (projects.length > 0 && onProjectUpdate) {
                  onProjectUpdate(projects[0]);
                }
                break;
            }
            
            setProgress(90);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        }
      });
    });
  };

  const processJsonFile = async (fileText: string, documentType: string) => {
    try {
      const jsonData = JSON.parse(fileText);
      
      setProgress(70);
      
      const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
      
      switch (documentType) {
        case 'budget':
          const budgetMap: Record<string, { used: number; total: number }> = {};
          
          dataArray.forEach(item => {
            const id = item.projectId || item.project_id || item.id;
            if (id) {
              budgetMap[id] = {
                total: Number(item.budget || item.total || 0),
                used: Number(item.spent || item.used || 0)
              };
            }
          });
          
          if (onBudgetUpdate) {
            onBudgetUpdate(budgetMap);
          }
          break;
          
        case 'tasks':
          const tasks = dataArray.map(item => ({
            title: item.title || item.summary || item.name || 'Untitled Task',
            description: item.description || item.desc || '',
            status: mapTaskStatus(item.status),
            priority: mapTaskPriority(item.priority),
            project_id: item.project_id || item.projectId || item.project || '',
            assignee: item.assignee || item.assigned_to || '',
            due_date: item.due_date || item.dueDate || item.deadline || ''
          }));
          
          if (onTasksImport) {
            onTasksImport(tasks);
          }
          break;
          
        case 'project':
        default:
          const projectData: Partial<ProjectData> = mapJsonToProjectData(dataArray[0]);
          
          if (onProjectUpdate) {
            onProjectUpdate(projectData as ProjectData);
          }
          break;
      }
      
      setProgress(90);
    } catch (error) {
      throw new Error(`JSON processing error: ${error instanceof Error ? error.message : 'Invalid JSON format'}`);
    }
  };

  const mapTaskStatus = (status: string): string => {
    if (!status) return 'todo';
    
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('done') || lowerStatus.includes('complete')) {
      return 'done';
    }
    
    if (lowerStatus.includes('progress') || lowerStatus.includes('doing') || lowerStatus.includes('in')) {
      return 'inProgress';
    }
    
    return 'todo';
  };

  const mapTaskPriority = (priority: string): string => {
    if (!priority) return 'medium';
    
    const lowerPriority = priority.toLowerCase();
    
    if (lowerPriority.includes('high') || lowerPriority.includes('critical') || lowerPriority.includes('urgent')) {
      return 'high';
    }
    
    if (lowerPriority.includes('low') || lowerPriority.includes('minor')) {
      return 'low';
    }
    
    return 'medium';
  };

  const mapJsonToProjectData = (json: any): Partial<ProjectData> => {
    // Extract project data with fallbacks for different naming conventions
    return {
      name: json.name || json.project_name || json.title || 'Untitled Project',
      client: json.client || json.customer || json.organization || json.company || 'Unknown Client',
      status: mapProjectStatus(json.status),
      description: json.description || json.desc || json.overview || json.summary || '',
      progress: Number(json.progress || json.completion || json.percent_complete || 0),
      budget: {
        total: Number(json.budget?.total || json.budget || json.total_budget || 0),
        used: Number(json.budget?.used || json.spent || json.used_budget || 0)
      },
      riskLevel: mapRiskLevel(json.risk_level || json.risk || json.riskLevel),
      startDate: json.start_date || json.startDate || json.start || '',
      endDate: json.end_date || json.endDate || json.deadline || '',
      id: json.id || json.project_id || String(Math.floor(Math.random() * 10000))
    };
  };

  const mapProjectStatus = (status: string): 'active' | 'completed' | 'onHold' | 'atRisk' => {
    if (!status) return 'active';
    
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('complet') || lowerStatus.includes('done') || lowerStatus.includes('finish')) {
      return 'completed';
    }
    
    if (lowerStatus.includes('hold') || lowerStatus.includes('pause') || lowerStatus.includes('suspend')) {
      return 'onHold';
    }
    
    if (lowerStatus.includes('risk') || lowerStatus.includes('danger') || lowerStatus.includes('issue')) {
      return 'atRisk';
    }
    
    return 'active';
  };

  const mapRiskLevel = (risk: string): 'low' | 'medium' | 'high' => {
    if (!risk) return 'medium';
    
    const lowerRisk = String(risk).toLowerCase();
    
    if (lowerRisk.includes('high') || lowerRisk.includes('critical') || lowerRisk === '3' || lowerRisk === '4' || lowerRisk === '5') {
      return 'high';
    }
    
    if (lowerRisk.includes('low') || lowerRisk.includes('minor') || lowerRisk === '1') {
      return 'low';
    }
    
    return 'medium';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileUp className="h-5 w-5 mr-2" />
          AI Document Processing
        </CardTitle>
        <CardDescription>
          Upload project documents and let AI automatically map and update your project information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="document-upload" className="text-sm font-medium">
            Upload Document
          </label>
          <input
            id="document-upload"
            type="file"
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 text-sm text-muted-foreground"
            onChange={handleFileChange}
            accept=".csv,.json,.xlsx,.xls,.txt,.md"
            disabled={isProcessing}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Supported formats: CSV, JSON, Excel, Text, Markdown
          </p>
        </div>

        {file && (
          <div className="flex items-center space-x-2 text-sm">
            <FileText className="h-4 w-4" />
            <span>{file.name}</span>
            <span className="text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">{processingStage}</p>
          </div>
        )}

        {result && (
          <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="flex">
              {result.success ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <p className="text-sm">{result.message}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={processFile} 
          disabled={!file || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>Process Document</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

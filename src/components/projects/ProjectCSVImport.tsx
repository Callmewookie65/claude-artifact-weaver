import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Download, FileUp } from "lucide-react";
import { ProjectData } from "@/types/project";

export interface ProjectData {
  name: string;
  client: string;
  projectManager?: string;
  status: string;
  progress?: number;
  budget?: { used: number; total: number };
  riskLevel?: string;
  startDate?: string;
  endDate?: string;
  margin?: number;
  hoursWorked?: number;
  estimatedTime?: number;
  lastActivity?: string;
  id?: string;
  description?: string;
  team?: Array<{ id: string; name: string; role: string; avatar: string }>;
  manager?: { id: string; name: string; avatar: string };
}

interface ProjectCSVImportProps {
  onImport: (projects: ProjectData[]) => void;
  onDownloadTemplate: () => void;
}

export const ProjectCSVImport: React.FC<ProjectCSVImportProps> = ({ onImport, onDownloadTemplate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [parsedData, setParsedData] = useState<ProjectData[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError(null);
    setProgress(0);
    
    if (!selectedFile) {
      return;
    }
    
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    
    setFile(selectedFile);
  };

  const parseCSV = async () => {
    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        step: (results, parser) => {
          setProgress(Math.round((results.meta.cursor / text.length) * 100));
        },
        complete: (results) => {
          if (results.data.length === 0) {
            setError('CSV file is empty or invalid');
            setIsLoading(false);
            return;
          }
          
          try {
            const formattedProjects: ProjectData[] = results.data
              .filter(project => project && typeof project === 'object')
              .map((project: any) => {
                try {
                  let client = project.Company || project.Client || project.client;
                  let startDate = project.startDate || project['Start date'] || project['Date created'] || '';
                  let endDate = project.endDate || project['End date'] || project.Deadline || '';
                  let status = project.Status || project.status || 'active';
                  
                  let budget = { used: 0, total: 0 };
                  
                  if (project.budget) {
                    if (typeof project.budget === 'string') {
                      try {
                        budget = JSON.parse(project.budget);
                      } catch (e) {
                        budget = {
                          used: parseFloat(project.budget.split(':')[0]) || 0,
                          total: parseFloat(project.budget.split(':')[1]) || 0
                        };
                      }
                    } else if (typeof project.budget === 'object') {
                      budget = project.budget;
                    }
                  } else {
                    const total = parseFloat(project['Open revenue'] || project['Budget'] || 0);
                    const used = total - parseFloat(project['Remaining'] || 0);
                    budget = {
                      used: isNaN(used) ? 0 : used,
                      total: isNaN(total) ? 0 : total
                    };
                  }
                  
                  let progress = project.progress || project.Progress;
                  if (!progress && project['Hours'] && project['Estimated time']) {
                    const hours = parseFloat(project['Hours']);
                    const estimated = parseFloat(project['Estimated time']);
                    if (estimated > 0) {
                      progress = Math.round((hours / estimated) * 100);
                    }
                  }
                  
                  return {
                    name: project.Name || project.name || `Project ${new Date().toISOString()}`,
                    client: client || 'Unknown Client',
                    projectManager: project['Project manager'] || project.ProjectManager || project.projectManager,
                    status: status.toLowerCase(),
                    progress: parseInt(progress) || 0,
                    budget: budget,
                    riskLevel: project.riskLevel || project['Risk level'] || project.Risk || 'medium',
                    startDate,
                    endDate,
                    margin: project.Margin,
                    hoursWorked: project.Hours || project['Worked time'],
                    estimatedTime: project['Estimated time'],
                    lastActivity: project['Last activity'],
                    id: project.ID || project.id || project.Number?.toString() || undefined,
                    description: project.Description,
                    team: project.Team,
                    manager: project.Manager
                  };
                } catch (err) {
                  console.error('Error processing project row:', err, project);
                  return null;
                }
              })
              .filter(Boolean) as ProjectData[];
              
            setParsedData(formattedProjects);
            setPreviewMode(true);
          } catch (err: any) {
            setError(`Error formatting data: ${err.message}`);
          }
        },
        error: (err) => {
          setError(`CSV parsing error: ${err.message}`);
        },
      });
    } catch (err: any) {
      setError(`Failed to read the CSV file: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmImport = () => {
    if (parsedData.length > 0) {
      onImport(parsedData);
      toast({
        title: "CSV imported successfully",
        description: `${parsedData.length} projects have been updated`
      });
      setIsOpen(false);
      setFile(null);
      setParsedData([]);
      setPreviewMode(false);
    } else {
      setError('No valid data to import');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFile(null);
    setParsedData([]);
    setPreviewMode(false);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
      setIsOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileUp className="h-4 w-4 mr-2" />
          Import Projects
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{previewMode ? 'Preview Import Data' : 'Import Projects'}</DialogTitle>
          <DialogDescription>
            {previewMode 
              ? `Found ${parsedData.length} projects in the CSV file. Review and confirm import.`
              : 'Upload a CSV file with project data to import or update projects.'}
          </DialogDescription>
        </DialogHeader>
        
        {!previewMode ? (
          <div className="grid gap-4 py-4">
            {error && (
              <div className="bg-destructive/10 dark:bg-destructive/20 text-destructive px-4 py-2 rounded-md flex items-center text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            
            <div className="grid gap-2">
              <label htmlFor="csv-file" className="text-sm font-medium">
                CSV File
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="flex-1"
                />
              </div>
              {file && (
                <div className="flex items-center text-sm text-green-600 dark:text-green-500">
                  <FileCheck className="h-4 w-4 mr-2" />
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </div>
              )}
              {isLoading && (
                <div className="mt-2 space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-center text-sm text-muted-foreground">{progress}% Processed</p>
                </div>
              )}
            </div>
            {onDownloadTemplate && (
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDownloadTemplate}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="font-medium mb-1">Required CSV columns:</p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded block">
                Name, Company/Client, Status, Project manager (optional), ...
              </code>
              <p className="mt-1">You can include additional data like budget, dates, hours, etc.</p>
            </div>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Client</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Manager</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.slice(0, 5).map((project, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 truncate max-w-[150px]">{project.name}</td>
                    <td className="px-4 py-2">{project.client}</td>
                    <td className="px-4 py-2">{project.status}</td>
                    <td className="px-4 py-2">{project.projectManager || 'N/A'}</td>
                  </tr>
                ))}
                {parsedData.length > 5 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center text-muted-foreground">
                      ...and {parsedData.length - 5} more projects
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <DialogFooter>
          {previewMode ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setPreviewMode(false)} 
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                onClick={confirmImport} 
                disabled={parsedData.length === 0}
              >
                Confirm Import
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)} 
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={parseCSV} 
                disabled={!file || isLoading}
                className={isLoading ? 'opacity-80' : ''}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FileUp className="h-4 w-4 mr-2" />
                    Parse CSV
                  </span>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

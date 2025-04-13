
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from '@/components/ui/progress';
import { AlertCircle, FileUp, FileCheck, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Papa from 'papaparse';
import { ProjectData } from './ProjectCSVImport';

interface BudgetData {
  ProjectID?: string;
  Project?: string;
  'Project name'?: string;
  Number?: string;
  Budget?: number;
  Spent?: number;
  Remaining?: number;
  'Percentage spent'?: number;
  Currency?: string;
  [key: string]: any;
}

interface BudgetCSVImportProps {
  onImport: (budgets: Record<string, { used: number; total: number }>) => void;
  onDownloadTemplate?: () => void;
}

export const BudgetCSVImport: React.FC<BudgetCSVImportProps> = ({ onImport, onDownloadTemplate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [parsedData, setParsedData] = useState<BudgetData[]>([]);
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
            const formattedBudgets = results.data
              .filter((data) => data && typeof data === 'object')
              .map((entry: any) => {
                // Process the raw data into our expected format
                let projectId = entry.ProjectID || entry['Project ID'] || entry.Number || '';
                let projectName = entry.Project || entry['Project name'] || '';
                
                let budget = parseFloat(entry.Budget) || 0;
                let spent = parseFloat(entry.Spent) || 0;
                
                // If we have budget and remaining, calculate spent
                if (entry.Budget && entry.Remaining && !entry.Spent) {
                  spent = parseFloat(entry.Budget) - parseFloat(entry.Remaining);
                }
                
                // If we have percentage spent and budget, calculate spent
                if (entry.Budget && entry['Percentage spent'] && !entry.Spent && !entry.Remaining) {
                  spent = (parseFloat(entry.Budget) * parseFloat(entry['Percentage spent'])) / 100;
                }
                
                return {
                  ProjectID: projectId,
                  Project: projectName,
                  Budget: budget,
                  Spent: spent,
                  Remaining: budget - spent,
                  'Percentage spent': budget > 0 ? Math.round((spent / budget) * 100) : 0,
                  Currency: entry.Currency || 'PLN'
                };
              });
              
            setParsedData(formattedBudgets);
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
      // Convert the parsed data to the format expected by the projects system
      const budgetMap: Record<string, { used: number; total: number }> = {};
      
      parsedData.forEach(entry => {
        // Use ProjectID or Project name as the key
        const key = entry.ProjectID || entry.Project || entry['Project name'];
        
        if (key && (entry.Budget !== undefined || entry.Spent !== undefined)) {
          budgetMap[key] = {
            total: entry.Budget || 0,
            used: entry.Spent || 0
          };
        }
      });
      
      onImport(budgetMap);
      toast({
        title: "Budget data imported successfully",
        description: `Budget information updated for ${Object.keys(budgetMap).length} projects`
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
          Import Budgets
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{previewMode ? 'Preview Budget Data' : 'Import Budget Data'}</DialogTitle>
          <DialogDescription>
            {previewMode 
              ? `Found budget information for ${parsedData.length} projects. Review and confirm import.`
              : 'Upload a CSV file with budget data to update multiple projects at once.'}
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
                Budget CSV File
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
              <p className="font-medium mb-1">Expected CSV columns:</p>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded block">
                ProjectID/Project ID, Project name, Budget, Spent, Remaining, Percentage spent, Currency
              </code>
              <p className="mt-1">At minimum, you need project identifiers and budget information.</p>
            </div>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Project ID/Name</th>
                  <th className="px-4 py-2 text-left">Budget</th>
                  <th className="px-4 py-2 text-left">Spent</th>
                  <th className="px-4 py-2 text-left">Remaining</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.slice(0, 5).map((budget, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 truncate max-w-[150px]">
                      {budget.ProjectID || budget.Project || 'Unknown'}
                    </td>
                    <td className="px-4 py-2">{budget.Budget?.toLocaleString()} {budget.Currency}</td>
                    <td className="px-4 py-2">{budget.Spent?.toLocaleString()} {budget.Currency}</td>
                    <td className="px-4 py-2">{budget.Remaining?.toLocaleString()} {budget.Currency}</td>
                  </tr>
                ))}
                {parsedData.length > 5 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center text-muted-foreground">
                      ...and {parsedData.length - 5} more budget entries
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


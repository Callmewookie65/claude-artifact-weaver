
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, FileUp, FileCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImportCSVDialogProps {
  onImport: (data: Record<string, any>) => void;
}

export const ImportCSVDialog = ({ onImport }: ImportCSVDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      return;
    }
    
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Read the file contents
      const text = await file.text();
      
      // Parse CSV
      const rows = text.split('\n');
      if (rows.length < 2) {
        throw new Error('CSV file is empty or invalid');
      }
      
      const headers = rows[0].split(',').map(header => header.trim());
      const dataRow = rows[1].split(',').map(value => value.trim());
      
      if (headers.length !== dataRow.length) {
        throw new Error('CSV format is invalid');
      }
      
      // Create object from CSV data
      const projectData: Record<string, any> = {};
      headers.forEach((header, index) => {
        if (header && header !== '') {
          projectData[header] = dataRow[index];
        }
      });
      
      // Check for required fields
      const requiredFields = ['name', 'client', 'description'];
      const missingFields = requiredFields.filter(field => !projectData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Process budget if present
      if (projectData.budget) {
        try {
          projectData.budget = JSON.parse(projectData.budget);
        } catch {
          // If not valid JSON, try to parse as "used,total" format
          const [used, total] = projectData.budget.split(':').map(Number);
          if (!isNaN(used) && !isNaN(total)) {
            projectData.budget = { used, total };
          } else {
            throw new Error('Budget format is invalid. Use JSON format {"used":25000,"total":50000} or "25000:50000"');
          }
        }
      }
      
      // Call the parent component's onImport function
      onImport(projectData);
      
      // Success notification
      toast({
        title: "CSV imported successfully",
        description: "The project has been updated with the imported data"
      });
      
      // Close the dialog
      setIsOpen(false);
      setFile(null);
      
    } catch (err: any) {
      setError(err.message || 'Failed to import CSV file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileUp className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Project Data</DialogTitle>
          <DialogDescription>
            Upload a CSV file to update this project's details.
          </DialogDescription>
        </DialogHeader>
        
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
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="font-medium mb-1">CSV Format:</p>
            <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded block">
              name,client,description,status,progress,riskLevel,startDate,endDate,budget<br />
              "Project Name","Client Name","Description here","active",50,"medium","2025-01-15","2025-06-30",{"{"}"used":25000,"total":50000{"}"}
            </code>
            <p className="mt-1">Required fields: name, client, description</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)} 
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!file || isLoading}
            className={isLoading ? 'opacity-80' : ''}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importing...
              </span>
            ) : (
              <span className="flex items-center">
                <FileUp className="h-4 w-4 mr-2" />
                Import
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

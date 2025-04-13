
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { FileItem } from './fileTypes';
import { FileDropZone } from './FileDropZone';
import { FileListItem } from './FileListItem';
import { handleFiles, parseCSV, parseJSON } from './fileUtils';

export const FileImporter: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const acceptableTypes = [
    'text/csv', 
    'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/json'
  ];
  
  const acceptedFormats = ['.csv', '.xlsx', '.json'];

  const handleFilesAdded = useCallback((fileList: File[]) => {
    const newFiles = handleFiles(fileList, acceptableTypes);
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const processFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "Brak plików",
        description: "Dodaj pliki przed importem",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const updatedFiles = [...files];
      const importedData = {
        projects: [],
        budgets: [],
        resources: []
      };

      for (let i = 0; i < updatedFiles.length; i++) {
        const file = updatedFiles[i];
        file.status = 'uploading';
        setFiles([...updatedFiles]);
        
        try {
          let data;
          if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            data = await parseCSV(file.file);
          } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
            data = await parseJSON(file.file);
          } else {
            throw new Error('Unsupported file type');
          }
          
          if (file.name.toLowerCase().includes('budget')) {
            importedData.budgets.push(...(Array.isArray(data) ? data : [data]));
          } else if (file.name.toLowerCase().includes('resource')) {
            importedData.resources.push(...(Array.isArray(data) ? data : [data]));
          } else {
            importedData.projects.push(...(Array.isArray(data) ? data : [data]));
          }
          
          file.status = 'success';
        } catch (error) {
          file.status = 'error';
          file.error = error instanceof Error ? error.message : 'Unknown error';
        }
        
        setFiles([...updatedFiles]);
      }

      if (importedData.projects.length > 0 || importedData.budgets.length > 0 || importedData.resources.length > 0) {
        localStorage.setItem('importedData', JSON.stringify(importedData));
        
        toast({
          title: "Import zakończony",
          description: `Zaimportowano ${importedData.projects.length} projektów, ${importedData.budgets.length} budżetów i ${importedData.resources.length} zasobów`,
        });

        setTimeout(() => {
          navigate('/projects');
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Błąd importu",
        description: error instanceof Error ? error.message : 'Nieznany błąd podczas importu',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <FileDropZone 
        onFilesAdded={handleFilesAdded} 
        acceptedFormats={acceptedFormats} 
        inputRef={fileInputRef}
      />

      {files.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-heading">Wybrane pliki</h2>
          <div className="space-y-4">
            {files.map((file) => (
              <FileListItem
                key={file.id}
                file={file}
                onRemove={removeFile}
                isProcessing={isProcessing}
              />
            ))}
          </div>
          <div className="flex justify-end">
            <Button 
              className="btn-primary"
              onClick={processFiles}
              disabled={isProcessing || files.length === 0}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Przetwarzanie...
                </>
              ) : (
                <>
                  Rozpocznij import
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

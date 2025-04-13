
import React, { useState, useRef, useCallback } from 'react';
import { FileUpload, Upload, FileCheck, AlertCircle, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  file: File;
  error?: string;
}

export const FileImporter: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = (file: File): FileItem => {
    return {
      id: `${file.name}-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'idle',
      file
    };
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (fileList: File[]) => {
    const acceptableTypes = [
      'text/csv', 
      'application/vnd.ms-excel', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json'
    ];

    const newFiles = fileList
      .filter(file => acceptableTypes.includes(file.type) || 
                      file.name.endsWith('.csv') ||
                      file.name.endsWith('.xlsx') ||
                      file.name.endsWith('.json'))
      .map(processFile);

    if (newFiles.length === 0) {
      toast({
        title: "Nieprawidłowy format pliku",
        description: "Akceptowane formaty: CSV, XLSX, JSON",
        variant: "destructive"
      });
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);

    toast({
      title: "Pliki dodane",
      description: `Dodano ${newFiles.length} plików do importu`,
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'text/csv' || fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileUpload className="h-8 w-8 text-terracotta" />;
    } else if (fileType === 'application/json') {
      return <FileCode className="h-8 w-8 text-coral" />;
    } else {
      return <FileUpload className="h-8 w-8 text-gold" />;
    }
  };

  const parseCSV = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(results.errors[0].message);
          } else {
            resolve(results.data);
          }
        },
        error: (error) => {
          reject(error.message);
        }
      });
    });
  };

  const parseJSON = async (file: File): Promise<any> => {
    try {
      const text = await file.text();
      return JSON.parse(text);
    } catch (error) {
      throw new Error('Invalid JSON file');
    }
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

      // Process all files
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
          
          // Determine data type based on content
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
        // Store imported data in localStorage or context
        localStorage.setItem('importedData', JSON.stringify(importedData));
        
        toast({
          title: "Import zakończony",
          description: `Zaimportowano ${importedData.projects.length} projektów, ${importedData.budgets.length} budżetów i ${importedData.resources.length} zasobów`,
        });

        // Redirect to projects page after short delay to show success message
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
      <div
        className={`border-2 border-dashed rounded-2xl p-10 transition-all cursor-pointer bg-opacity-5 flex flex-col items-center justify-center min-h-[300px] ${
          isDragging ? 'border-coral bg-coral' : 'border-[#333] bg-[#111] hover:bg-coral hover:bg-opacity-5 hover:border-coral'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInput}
          multiple
          accept=".csv,.xlsx,.json"
        />
        <Upload className={`h-16 w-16 mb-4 ${isDragging ? 'text-coral' : 'text-[#666]'}`} />
        <h3 className="text-xl font-heading mb-2">Przeciągnij i upuść pliki</h3>
        <p className="text-[#999] mb-6 text-center max-w-md">
          Akceptowane formaty: CSV, XLSX, JSON
        </p>
        <Button className="btn-primary">
          <Upload className="mr-2 h-5 w-5" />
          Wybierz pliki
        </Button>
      </div>

      {files.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-heading">Wybrane pliki</h2>
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="card-new flex items-center justify-between"
              >
                <div className="flex items-center">
                  {getFileIcon(file.type)}
                  <div className="ml-4">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-[#999]">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {file.status === 'idle' && (
                    <span className="text-[#999] text-sm mr-4">Oczekuje</span>
                  )}
                  {file.status === 'uploading' && (
                    <span className="text-coral text-sm mr-4 animate-pulse">Przetwarzanie...</span>
                  )}
                  {file.status === 'success' && (
                    <span className="text-green-500 flex items-center text-sm mr-4">
                      <FileCheck className="h-4 w-4 mr-1" />
                      Zaimportowany
                    </span>
                  )}
                  {file.status === 'error' && (
                    <span className="text-red-500 flex items-center text-sm mr-4">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {file.error || 'Błąd'}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="text-[#999] hover:text-white"
                    disabled={isProcessing}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>
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

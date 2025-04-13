
import Papa from 'papaparse';
import { FileItem } from './fileTypes';
import { toast } from '@/hooks/use-toast';

export const processFile = (file: File): FileItem => {
  return {
    id: `${file.name}-${Date.now()}`,
    name: file.name,
    size: file.size,
    type: file.type,
    status: 'idle',
    file
  };
};

export const filterAcceptableFiles = (fileList: File[], acceptableTypes: string[]): File[] => {
  return fileList.filter(file => 
    acceptableTypes.includes(file.type) || 
    file.name.endsWith('.csv') ||
    file.name.endsWith('.xlsx') ||
    file.name.endsWith('.json')
  );
};

export const parseCSV = (file: File): Promise<any[]> => {
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

export const parseJSON = async (file: File): Promise<any> => {
  try {
    const text = await file.text();
    return JSON.parse(text);
  } catch (error) {
    throw new Error('Invalid JSON file');
  }
};

export const handleFiles = (fileList: File[], acceptableTypes: string[]): FileItem[] => {
  const filteredFiles = filterAcceptableFiles(fileList, acceptableTypes);
  
  if (filteredFiles.length === 0) {
    toast({
      title: "Nieprawidłowy format pliku",
      description: "Akceptowane formaty: CSV, XLSX, JSON",
      variant: "destructive"
    });
    return [];
  }
  
  const newFiles = filteredFiles.map(processFile);
  
  toast({
    title: "Pliki dodane",
    description: `Dodano ${newFiles.length} plików do importu`,
  });
  
  return newFiles;
};

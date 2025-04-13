
import React from 'react';
import { File, AlertCircle, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileItem } from './fileTypes';

interface FileListItemProps {
  file: FileItem;
  onRemove: (id: string) => void;
  isProcessing: boolean;
}

export const getFileIcon = (fileType: string) => {
  if (fileType === 'text/csv' || fileType.includes('spreadsheet') || fileType.includes('excel')) {
    return <File className="h-8 w-8 text-terracotta" />;
  } else if (fileType === 'application/json') {
    return <File className="h-8 w-8 text-coral" />;
  } else {
    return <File className="h-8 w-8 text-gold" />;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

export const FileListItem: React.FC<FileListItemProps> = ({ file, onRemove, isProcessing }) => {
  return (
    <div className="card-new flex items-center justify-between">
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
            onRemove(file.id);
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
  );
};

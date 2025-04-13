
import React, { useCallback, useState } from 'react';
import { UploadCloud, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileDropZoneProps {
  onFilesAdded: (files: File[]) => void;
  acceptedFormats: string[];
  inputRef: React.RefObject<HTMLInputElement>;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({ 
  onFilesAdded, 
  acceptedFormats,
  inputRef
}) => {
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onFilesAdded(droppedFiles);
    }
  }, [onFilesAdded]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
    }
  };

  const acceptAttribute = acceptedFormats.join(',');

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-10 transition-all cursor-pointer bg-opacity-5 flex flex-col items-center justify-center min-h-[300px] ${
        isDragging ? 'border-coral bg-coral' : 'border-[#333] bg-[#111] hover:bg-coral hover:bg-opacity-5 hover:border-coral'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileInput}
        multiple
        accept={acceptAttribute}
      />
      <UploadCloud className={`h-16 w-16 mb-4 ${isDragging ? 'text-coral' : 'text-[#666]'}`} />
      <h3 className="text-xl font-heading mb-2">Przeciągnij i upuść pliki</h3>
      <p className="text-[#999] mb-6 text-center max-w-md">
        Akceptowane formaty: {acceptedFormats.map(format => format.replace('.', '').toUpperCase()).join(', ')}
      </p>
      <Button className="btn-primary">
        <Upload className="mr-2 h-5 w-5" />
        Wybierz pliki
      </Button>
    </div>
  );
};

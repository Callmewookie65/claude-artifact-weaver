
export type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  file: File;
  error?: string;
}

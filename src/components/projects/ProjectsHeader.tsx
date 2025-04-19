
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectsHeaderProps {
  handleDownloadTemplate: () => void;
}

export const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  handleDownloadTemplate,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-custom">Projects</h1>
        <p className="text-muted-foreground">Manage your project portfolio</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleDownloadTemplate}
          variant="outline"
          className="hover:bg-accent"
        >
          Download Template
        </Button>
        <Button asChild className="bg-black hover:bg-black/90">
          <Link to="/ai/tools">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>
    </div>
  );
};

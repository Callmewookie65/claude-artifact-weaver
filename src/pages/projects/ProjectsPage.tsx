
import React from 'react';
import { ProjectsHeader } from '@/components/projects/ProjectsHeader';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { useProjectManagement } from '@/hooks/useProjectManagement';

export default function ProjectsPage() {
  const { 
    projects, 
    handleDownloadTemplate,
  } = useProjectManagement();

  return (
    <div className="space-y-6">
      <ProjectsHeader
        handleDownloadTemplate={handleDownloadTemplate}
      />
      <ProjectsList projects={projects} />
    </div>
  );
}

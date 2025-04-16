
import React from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectData } from '@/types/project';

interface ProjectsListProps {
  projects: ProjectData[];
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

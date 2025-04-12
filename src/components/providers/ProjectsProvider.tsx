
import React, { createContext, useState, ReactNode } from 'react';
import { ProjectData } from '../projects/ProjectCSVImport';

interface ProjectsContextType {
  projects: ProjectData[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectData[]>>;
}

export const ProjectsContext = createContext<ProjectsContextType>({
  projects: [],
  setProjects: () => {}
});

interface ProjectsProviderProps {
  children: ReactNode;
}

export const ProjectsProvider: React.FC<ProjectsProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  
  return (
    <ProjectsContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};

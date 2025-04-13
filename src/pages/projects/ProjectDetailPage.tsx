
import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { ProjectsContext } from '@/components/providers/ProjectsProvider';
import { ProjectData } from '@/components/projects/ProjectCSVImport';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectSummary } from '@/components/projects/ProjectSummary';
import { ProjectProgress } from '@/components/projects/ProjectProgress';
import { ProjectBudget } from '@/components/projects/ProjectBudget';
import { ProjectTabs } from '@/components/projects/ProjectTabs';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { projects, setProjects } = useContext(ProjectsContext);
  
  const [project, setProject] = useState<ProjectData | null>(null);
  
  useEffect(() => {
    const foundProject = projects.find(p => p.id === id);
    
    if (foundProject) {
      setProject(foundProject);
    } else {
      const defaultProject: ProjectData = {
        id,
        name: 'Redesign Strony Głównej',
        client: 'Acme Corp',
        status: 'active',
        description: "Complete redesign of the client's main website, including modernization of UI, UX improvements, and SEO optimization.",
        progress: 45,
        budget: { used: 25000, total: 50000 },
        riskLevel: 'medium',
        startDate: '2025-01-15',
        endDate: '2025-06-30',
        manager: {
          id: '1',
          name: 'Jan Kowalski',
          avatar: 'JK'
        },
        team: [
          { id: '2', name: 'Anna Nowak', role: 'Designer', avatar: 'AN' },
          { id: '3', name: 'Piotr Wiśniewski', role: 'Developer', avatar: 'PW' },
          { id: '4', name: 'Marta Lewandowska', role: 'Content Manager', avatar: 'ML' }
        ]
      };
      setProject(defaultProject);
    }
  }, [id, projects]);
  
  const handleImportCSV = (data: ProjectData[]) => {
    const importedProject = data.find(p => p.id === id) || data[0];
    
    if (!importedProject) {
      toast({
        title: "Import Error",
        description: "No matching project found in the CSV data",
        variant: "destructive"
      });
      return;
    }
    
    setProject(prev => {
      if (!prev) return importedProject;
      
      const updated = {
        ...prev,
        ...importedProject,
        team: prev.team || [],
        manager: prev.manager
      };
      
      setProjects(prevProjects => 
        prevProjects.map(p => p.id === id ? updated : p)
      );
      
      return updated;
    });

    toast({
      title: "Project Updated",
      description: `Project "${importedProject.name}" has been updated successfully.`,
    });
  };
  
  const handleDownloadTemplate = () => {
    if (!project) return;
    
    const headers = "name,client,status,projectManager,progress,budget,riskLevel,startDate,endDate,hoursWorked,estimatedTime,margin,id\n";
    
    const budget = project.budget ? 
      JSON.stringify(project.budget).replace(/"/g, '""') : 
      '{"used":0,"total":0}';
    
    const row = [
      `"${project.name}"`,
      `"${project.client}"`,
      `"${project.status}"`,
      `"${project.projectManager || ''}"`,
      project.progress || 0,
      `"${budget}"`,
      `"${project.riskLevel || 'medium'}"`,
      `"${project.startDate || ''}"`,
      `"${project.endDate || ''}"`,
      project.hoursWorked || '',
      project.estimatedTime || '',
      project.margin || '',
      `"${project.id}"`,
    ].join(',');
    
    const csvContent = `${headers}${row}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `project-${project.id}-export.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Template Downloaded",
      description: "You can update this file and import it back to update the project"
    });
  };
  
  if (!project) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Loading project...</h2>
          <p className="text-muted-foreground">Please wait while we load your project data.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <ProjectHeader 
        project={project}
        onImportCSV={handleImportCSV}
        onDownloadTemplate={handleDownloadTemplate}
      />
      
      <ProjectSummary project={project} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectProgress project={project} />
        <ProjectBudget project={project} />
      </div>
      
      <ProjectTabs 
        project={project}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

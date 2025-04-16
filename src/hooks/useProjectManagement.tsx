
import { useState, useEffect, useContext } from 'react';
import { ProjectData } from '@/types/project';
import { toast } from "@/hooks/use-toast";
import { ProjectsContext } from '@/components/providers/ProjectsProvider';
import { generateBudgetTemplate, updateProjectBudgets } from '@/utils/csvExport';

export function useProjectManagement() {
  const { projects, setProjects } = useContext(ProjectsContext);
  
  // Initialize with sample project data if context is empty
  useEffect(() => {
    if (projects.length === 0) {
      setProjects([
        {
          id: '101',
          name: 'Redesign Strony Głównej',
          client: 'Acme Corp',
          status: 'active',
          progress: 45,
          budget: { used: 25000, total: 50000 },
          riskLevel: 'medium',
          startDate: '2025-01-15',
          endDate: '2025-06-30',
        },
        {
          id: '102',
          name: 'Aplikacja Mobilna',
          client: 'XYZ Ltd',
          status: 'active',
          progress: 20,
          budget: { used: 12000, total: 100000 },
          riskLevel: 'low',
          startDate: '2025-02-01',
          endDate: '2025-08-31',
        },
        {
          id: '103',
          name: 'System CRM',
          client: 'Best Company',
          status: 'atRisk',
          progress: 65,
          budget: { used: 88000, total: 90000 },
          riskLevel: 'high',
          startDate: '2025-01-01',
          endDate: '2025-05-15',
        }
      ]);
    }
  }, [projects.length, setProjects]);

  // Handle download template
  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/templates/projects-template.csv';
    link.download = 'projects-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Template Downloaded",
      description: "Fill the template with your project data and import it back"
    });
  };
  
  // Handle budget import
  const handleBudgetImport = (budgetMap: Record<string, { used: number; total: number }>) => {
    const updatedProjects = updateProjectBudgets(projects, budgetMap);
    setProjects(updatedProjects);
    
    toast({
      title: "Budgets Updated",
      description: `Budget information updated for ${Object.keys(budgetMap).length} projects`
    });
  };
  
  // Handle budget template download
  const handleDownloadBudgetTemplate = () => {
    generateBudgetTemplate();
    
    toast({
      title: "Budget Template Downloaded",
      description: "Fill the template with budget data and import it back"
    });
  };
  
  // Handle import projects from CSV
  const handleImportProjects = (importedProjects: ProjectData[]) => {
    // In a real app, you might want to merge with existing projects or update database
    // Here we'll just replace the projects state with the imported data
    setProjects(prevProjects => {
      // Create a map of existing projects by ID for quick lookup
      const existingProjectsMap = new Map(
        prevProjects.map(project => [project.id, project])
      );
      
      // Process imported projects to update existing or add new
      const updatedProjects = [...prevProjects];
      
      importedProjects.forEach(imported => {
        const existingIndex = updatedProjects.findIndex(p => p.id === imported.id);
        
        if (existingIndex >= 0) {
          // Update existing project
          updatedProjects[existingIndex] = { 
            ...updatedProjects[existingIndex],
            ...imported 
          };
        } else {
          // Add as new project
          updatedProjects.push({
            ...imported,
            id: imported.id || String(Math.floor(Math.random() * 10000) + 1000)
          });
        }
      });
      
      return updatedProjects;
    });
    
    toast({
      title: "Projects Imported",
      description: `Successfully imported ${importedProjects.length} projects`
    });
  };

  return {
    projects,
    handleDownloadTemplate,
    handleBudgetImport,
    handleDownloadBudgetTemplate,
    handleImportProjects
  };
}

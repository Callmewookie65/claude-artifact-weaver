
import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Plus, Filter, ArrowUpDown, Download } from 'lucide-react';
import { ProjectCSVImport, ProjectData } from '@/components/projects/ProjectCSVImport';
import { BudgetCSVImport } from '@/components/projects/BudgetCSVImport';
import { toast } from "@/hooks/use-toast";
import { generateBudgetTemplate, updateProjectBudgets } from '@/utils/csvExport';
import { ProjectsContext } from '@/components/providers/ProjectsProvider';

export default function ProjectsPage() {
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

  // Format budget as percentage
  const getBudgetPercentage = (used: number, total: number) => {
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  // Get risk badge
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'low': return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      case 'medium': return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'high': return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">High</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'completed': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      case 'onHold': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">On Hold</Badge>;
      case 'atRisk': return <Badge className="bg-red-100 text-red-800 border-red-200">At Risk</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Projects</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
          <ProjectCSVImport 
            onImport={handleImportProjects} 
            onDownloadTemplate={handleDownloadTemplate} 
          />
          <BudgetCSVImport 
            onImport={handleBudgetImport}
            onDownloadTemplate={handleDownloadBudgetTemplate}
          />
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>{project.client}</CardDescription>
                </div>
                {getStatusBadge(project.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.projectManager && (
                <div className="text-sm text-muted-foreground">
                  Manager: {project.projectManager}
                </div>
              )}
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              
              {project.budget && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Budget</span>
                    <span className="text-sm font-medium">
                      {getBudgetPercentage(project.budget.used, project.budget.total)}%
                    </span>
                  </div>
                  <Progress 
                    value={getBudgetPercentage(project.budget.used, project.budget.total)} 
                    className={`h-2 ${getBudgetPercentage(project.budget.used, project.budget.total) > 90 ? 'bg-red-200' : ''}`} 
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {project.budget.used.toLocaleString()} / {project.budget.total.toLocaleString()} PLN
                    </span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-3 text-xs text-muted-foreground">
                <div className="flex flex-col">
                  <span>Risk</span>
                  <span className="font-medium text-foreground">{getRiskBadge(project.riskLevel || 'medium')}</span>
                </div>
                {project.hoursWorked && project.estimatedTime && (
                  <div className="flex flex-col">
                    <span>Hours</span>
                    <span className="font-medium text-foreground">
                      {project.hoursWorked} / {project.estimatedTime}
                    </span>
                  </div>
                )}
                {project.margin && (
                  <div className="flex flex-col">
                    <span>Margin</span>
                    <span className="font-medium text-foreground">{project.margin}%</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 text-xs text-muted-foreground">
                {project.startDate && (
                  <div className="flex flex-col">
                    <span>Start</span>
                    <span className="font-medium text-foreground">
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {project.endDate && (
                  <div className="flex flex-col">
                    <span>End</span>
                    <span className="font-medium text-foreground">
                      {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              
              {project.lastActivity && (
                <div className="text-xs text-muted-foreground">
                  Last activity: {new Date(project.lastActivity).toLocaleString()}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to={`/projects/${project.id}`}>View Project</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

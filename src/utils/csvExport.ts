
/**
 * Generate a CSV template file for budget data
 */
export const generateBudgetTemplate = () => {
  const headers = "ProjectID,Project,Budget,Spent,Remaining,Percentage spent,Currency\n";
  
  // Example rows
  const exampleRows = [
    '101,"Redesign Strony Głównej",50000,25000,25000,50,PLN',
    '102,"Aplikacja Mobilna",100000,12000,88000,12,PLN',
    '103,"System CRM",90000,88000,2000,98,PLN'
  ].join('\n');
  
  const csvContent = `${headers}${exampleRows}`;
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'budget-template.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Generate a generic project template file
 */
export const generateProjectTemplate = () => {
  const headers = "ProjectID,Project,Client,Status,StartDate,EndDate,Progress,Manager,Team,Description\n";
  
  // Example rows
  const exampleRows = [
    '101,"Redesign Strony Głównej","Acme Corp","active","2025-01-15","2025-06-30",45,"Jan Kowalski","Anna Nowak,Piotr Wiśniewski","Kompleksowy redesign strony głównej klienta"',
    '102,"Aplikacja Mobilna","XYZ Ltd","active","2025-02-01","2025-08-31",20,"Maria Nowak","Jan Kowalski,Anna Zielińska","Rozwój aplikacji mobilnej dla klienta"'
  ].join('\n');
  
  const csvContent = `${headers}${exampleRows}`;
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'project-template.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Generate a resources template file
 */
export const generateResourcesTemplate = () => {
  const headers = "ResourceID,Name,Role,HourlyRate,Availability,Skills,Email,Phone\n";
  
  // Example rows
  const exampleRows = [
    '1,"Jan Kowalski","Project Manager",150,80,"Leadership,Communication,Planning","jan.kowalski@example.com","+48123456789"',
    '2,"Anna Nowak","Designer",120,100,"UI,UX,Figma","anna.nowak@example.com","+48987654321"',
    '3,"Piotr Wiśniewski","Developer",130,60,"React,TypeScript,Node.js","piotr.wisniewski@example.com","+48567891234"'
  ].join('\n');
  
  const csvContent = `${headers}${exampleRows}`;
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'resources-template.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Handle project budget updates from imported data
 * @param projects Current projects array
 * @param budgetMap Budget data map keyed by project ID or name
 * @returns Updated projects array
 */
export const updateProjectBudgets = (
  projects: any[], 
  budgetMap: Record<string, { used: number; total: number }>
) => {
  return projects.map(project => {
    // Try to find a matching budget entry by ID or name
    const budgetEntry = 
      budgetMap[project.id] || 
      budgetMap[project.name] || 
      budgetMap[project.client] ||
      null;
    
    if (budgetEntry) {
      return {
        ...project,
        budget: budgetEntry
      };
    }
    
    return project;
  });
};

/**
 * Process and map imported budget data
 * @param data Raw budget data from import
 * @returns Mapped budget data
 */
export const processBudgetImport = (data: any[]): Record<string, { used: number; total: number }> => {
  const budgetMap: Record<string, { used: number; total: number }> = {};
  
  data.forEach(budgetEntry => {
    // Handle different possible field names
    const projectId = budgetEntry.ProjectID || budgetEntry.projectId || budgetEntry.projectID || budgetEntry.id;
    const projectName = budgetEntry.Project || budgetEntry.project || budgetEntry.projectName || budgetEntry.name;
    const key = projectId || projectName;
    
    if (key) {
      const budget = parseFloat(budgetEntry.Budget || budgetEntry.budget || 0);
      const spent = parseFloat(budgetEntry.Spent || budgetEntry.spent || budgetEntry.used || 0);
      const remaining = parseFloat(budgetEntry.Remaining || budgetEntry.remaining || (budget - spent));
      
      budgetMap[key] = {
        total: budget,
        used: spent
      };
    }
  });
  
  return budgetMap;
};

/**
 * Process imported project data
 * @param data Raw project data from import
 * @returns Processed project data
 */
export const processProjectImport = (data: any[]): any[] => {
  return data.map(project => {
    // Normalize project structure
    return {
      id: project.ProjectID || project.projectId || project.id || `proj-${Date.now()}`,
      name: project.Project || project.projectName || project.name || "Unnamed Project",
      client: project.Client || project.client || "Unknown Client",
      status: project.Status || project.status || "active",
      description: project.Description || project.description || "",
      progress: parseInt(project.Progress || project.progress || 0),
      startDate: project.StartDate || project.startDate || new Date().toISOString().split('T')[0],
      endDate: project.EndDate || project.endDate || "",
      manager: {
        id: '1',
        name: project.Manager || project.manager || "Unassigned",
        avatar: getInitials(project.Manager || project.manager || "UN")
      },
      team: processTeam(project.Team || project.team),
      budget: {
        used: parseInt(project.Spent || project.spent || 0),
        total: parseInt(project.Budget || project.budget || 0)
      },
      riskLevel: project.RiskLevel || project.riskLevel || "medium"
    };
  });
};

/**
 * Process team members from import
 * @param teamInput Team input from import (could be string or array)
 * @returns Processed team array
 */
const processTeam = (teamInput: any): any[] => {
  if (!teamInput) return [];
  
  // If it's a string, assume comma-separated list
  if (typeof teamInput === 'string') {
    return teamInput.split(',').map((name, index) => ({
      id: `${index + 1}`,
      name: name.trim(),
      role: "Team Member",
      avatar: getInitials(name.trim())
    }));
  }
  
  // If it's already an array
  if (Array.isArray(teamInput)) {
    return teamInput.map((member, index) => {
      if (typeof member === 'string') {
        return {
          id: `${index + 1}`,
          name: member.trim(),
          role: "Team Member",
          avatar: getInitials(member.trim())
        };
      }
      return {
        id: member.id || `${index + 1}`,
        name: member.name || "Team Member",
        role: member.role || "Team Member",
        avatar: member.avatar || getInitials(member.name || "TM")
      };
    });
  }
  
  return [];
};

/**
 * Get initials from a name
 * @param name Full name
 * @returns Initials (up to 2 characters)
 */
const getInitials = (name: string): string => {
  if (!name) return "??";
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

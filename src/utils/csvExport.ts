
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

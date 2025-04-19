
import { mapValueToEnum } from './mappingUtils';

/**
 * Process imported task data from CSV or JSON
 * @param data Raw task data from import
 * @returns Processed task data
 */
export const processTasks = (data: any[]): any[] => {
  return data.map(task => {
    // Try to extract project ID using different possible field names
    const projectId = task.project_id || 
                      task.projectId || 
                      task.project || 
                      task.projectKey || 
                      task.ProjectID || 
                      '';
    
    // Map task status from various naming conventions
    let status = mapTaskStatus(task.status || task.State || task.state || 'todo');
    
    // Map priority from various naming conventions
    let priority = mapTaskPriority(
      task.priority || 
      task.Priority || 
      task.importance || 
      'medium'
    );
    
    // Extract assignee information
    const assignee = task.assignee || 
                     task.Assignee || 
                     task.assigned_to || 
                     task.AssignedTo || 
                     '';
    
    // Extract due date
    const dueDate = task.due_date || 
                    task.dueDate || 
                    task.DueDate || 
                    task.deadline || 
                    task.Deadline || 
                    '';
    
    // Build normalized task object
    return {
      title: task.title || task.summary || task.name || task.Task || task.issue || 'Untitled Task',
      description: task.description || task.desc || task.Description || task.notes || '',
      status,
      priority,
      project_id: projectId,
      assignee,
      due_date: dueDate
    };
  });
};

/**
 * Map various task status values to standardized status
 * @param status Raw status string from imported data
 * @returns Normalized status value
 */
export const mapTaskStatus = (status: string): string => {
  if (!status) return 'todo';
  
  const statusMap: Record<string, string> = {
    // Done statuses
    'done': 'done',
    'complete': 'done',
    'completed': 'done',
    'finished': 'done',
    'resolved': 'done',
    'closed': 'done',
    
    // In progress statuses
    'in progress': 'inProgress',
    'inprogress': 'inProgress',
    'wip': 'inProgress',
    'started': 'inProgress',
    'doing': 'inProgress',
    'in development': 'inProgress',
    'development': 'inProgress',
    'in review': 'inProgress',
    'review': 'inProgress',
    'testing': 'inProgress',
    
    // Todo statuses
    'todo': 'todo',
    'to do': 'todo',
    'not started': 'todo',
    'open': 'todo',
    'backlog': 'todo',
    'new': 'todo',
    'planned': 'todo'
  };
  
  const lowerStatus = status.toLowerCase();
  
  // Try direct mapping first
  if (statusMap[lowerStatus]) {
    return statusMap[lowerStatus];
  }
  
  // Use partial matching as a fallback
  if (lowerStatus.includes('done') || lowerStatus.includes('complete') || 
      lowerStatus.includes('finish') || lowerStatus.includes('resolved') || 
      lowerStatus.includes('closed')) {
    return 'done';
  }
  
  if (lowerStatus.includes('progress') || lowerStatus.includes('doing') || 
      lowerStatus.includes('start') || lowerStatus.includes('review') || 
      lowerStatus.includes('develop') || lowerStatus.includes('testing')) {
    return 'inProgress';
  }
  
  // Default to todo
  return 'todo';
};

/**
 * Map various priority values to standardized priority
 * @param priority Raw priority string from imported data
 * @returns Normalized priority value
 */
export const mapTaskPriority = (priority: string): string => {
  if (!priority) return 'medium';
  
  const priorityMap: Record<string, string> = {
    // High priority
    'high': 'high',
    'critical': 'high',
    'urgent': 'high',
    'highest': 'high',
    'p1': 'high',
    'p0': 'high',
    '1': 'high',
    '2': 'high',
    
    // Medium priority
    'medium': 'medium',
    'normal': 'medium',
    'standard': 'medium',
    'p2': 'medium',
    'p3': 'medium',
    '3': 'medium',
    
    // Low priority
    'low': 'low',
    'minor': 'low',
    'trivial': 'low',
    'lowest': 'low',
    'p4': 'low',
    'p5': 'low',
    '4': 'low',
    '5': 'low'
  };
  
  const lowerPriority = String(priority).toLowerCase();
  
  // Try direct mapping first
  if (priorityMap[lowerPriority]) {
    return priorityMap[lowerPriority];
  }
  
  // Use partial matching as a fallback
  if (lowerPriority.includes('high') || lowerPriority.includes('critical') || 
      lowerPriority.includes('urgent') || lowerPriority.includes('blocker')) {
    return 'high';
  }
  
  if (lowerPriority.includes('low') || lowerPriority.includes('minor') || 
      lowerPriority.includes('trivial')) {
    return 'low';
  }
  
  // Default to medium
  return 'medium';
};

import { ProjectData } from '@/types/project';
import { mapValueToEnum, cleanTextForComparison, calculateStringSimilarity, extractNumberValue, extractDateValue } from '@/utils/mappingUtils';
import { toast } from '@/hooks/use-toast';

export interface DocumentProcessingResult {
  projectData?: Partial<ProjectData>;
  taskData?: Array<any>;
  budgetData?: Record<string, { used: number; total: number }>;
  documentType: 'project' | 'task' | 'budget' | 'unknown';
  confidence: number;
  possibleProjects?: Array<{id: string, name: string, similarity: number}>;
}

export class DocumentProcessingService {
  /**
   * Process a document to extract relevant project information
   */
  static async processDocument(file: File): Promise<DocumentProcessingResult> {
    try {
      // Read file content
      const fileContent = await this.readFileContent(file);
      
      // Analyze file content to determine type
      const documentType = await this.determineDocumentType(file, fileContent);
      
      // Process file based on detected type
      switch (documentType) {
        case 'project':
          return this.processProjectDocument(fileContent);
        case 'task':
          return this.processTaskDocument(fileContent);
        case 'budget':
          return this.processBudgetDocument(fileContent);
        default:
          return { documentType: 'unknown', confidence: 0 };
      }
    } catch (error) {
      console.error('Document processing error:', error);
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: `Failed to process document: ${error.message}`
      });
      return { documentType: 'unknown', confidence: 0 };
    }
  }

  /**
   * Read file content based on file type
   */
  private static async readFileContent(file: File): Promise<any> {
    // Use existing file utilities
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
      const { parseCSV } = await import('@/components/import/fileUtils');
      return parseCSV(file);
    } else if (fileType === 'application/json' || fileName.endsWith('.json')) {
      const { parseJSON } = await import('@/components/import/fileUtils');
      return parseJSON(file);
    } else if (fileName.endsWith('.xlsx') || 
               fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
               fileType === 'application/vnd.ms-excel') {
      // TODO: Add XLSX parsing when available
      throw new Error("XLSX parsing not yet implemented");
    } else if (fileName.endsWith('.md') || fileType === 'text/markdown') {
      return this.readTextFile(file);
    } else if (fileName.endsWith('.txt') || fileType === 'text/plain') {
      return this.readTextFile(file);
    } else {
      throw new Error("Unsupported file format");
    }
  }

  /**
   * Read a text file
   */
  private static async readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  /**
   * Determine document type based on content
   */
  private static async determineDocumentType(
    file: File, 
    content: any
  ): Promise<'project' | 'task' | 'budget' | 'unknown'> {
    const fileName = file.name.toLowerCase();
    
    // First check filename for obvious clues
    if (fileName.includes('budget') || fileName.includes('finance')) {
      return 'budget';
    }
    
    if (fileName.includes('task') || fileName.includes('jira') || fileName.includes('sprint')) {
      return 'task';
    }
    
    if (fileName.includes('project') || fileName.includes('charter')) {
      return 'project';
    }
    
    // Then analyze content
    if (Array.isArray(content)) {
      // Check first item for columns
      if (content.length > 0) {
        const firstItem = content[0];
        
        // Check if it's a budget file
        const budgetKeywords = ['budget', 'cost', 'expense', 'spend', 'finance', 'price', 'amount', 'total'];
        if (this.objectContainsAnyKey(firstItem, budgetKeywords)) {
          return 'budget';
        }
        
        // Check if it's a task file
        const taskKeywords = ['task', 'story', 'epic', 'sprint', 'jira', 'assignee', 'status', 'due'];
        if (this.objectContainsAnyKey(firstItem, taskKeywords)) {
          return 'task';
        }
        
        // Check if it's a project file
        const projectKeywords = ['project', 'client', 'start', 'end', 'manager', 'description', 'risk'];
        if (this.objectContainsAnyKey(firstItem, projectKeywords)) {
          return 'project';
        }
      }
    }
    
    // If we still can't determine, default to unknown
    return 'unknown';
  }
  
  /**
   * Check if an object contains any of the specified keywords in its keys
   */
  private static objectContainsAnyKey(obj: any, keywords: string[]): boolean {
    if (!obj || typeof obj !== 'object') return false;
    
    return Object.keys(obj).some(key => {
      const normalizedKey = cleanTextForComparison(key);
      return keywords.some(keyword => normalizedKey.includes(cleanTextForComparison(keyword)));
    });
  }

  /**
   * Process a project document
   */
  private static async processProjectDocument(content: any[]): Promise<DocumentProcessingResult> {
    // Handle array of project data
    if (Array.isArray(content) && content.length > 0) {
      const firstItem = content[0];
      
      // Detect field mappings
      const mappings = this.detectProjectFieldMappings(firstItem);
      
      // Extract project data using mappings
      const projectData = this.extractProjectData(firstItem, mappings);
      
      return {
        documentType: 'project',
        confidence: 0.85,
        projectData
      };
    }
    
    // If content is not an array or is empty, check if it's already in a compatible format
    if (content && typeof content === 'object') {
      return {
        documentType: 'project',
        confidence: 0.5,
        projectData: content as Partial<ProjectData>
      };
    }
    
    // Return minimal result if we couldn't extract project data
    return {
      documentType: 'project',
      confidence: 0.3,
      projectData: {}
    };
  }
  
  /**
   * Detect field mappings for project data
   */
  private static detectProjectFieldMappings(item: any): Record<string, string> {
    const mappings: Record<string, string> = {};
    const targetFields = [
      'id', 'name', 'client', 'status', 'progress', 'description', 
      'riskLevel', 'startDate', 'endDate', 'projectManager', 
      'hoursWorked', 'estimatedTime', 'margin'
    ];
    
    // For each field we want to find in our project data
    targetFields.forEach(targetField => {
      // Look for an exact match first
      if (targetField in item) {
        mappings[targetField] = targetField;
        return;
      }
      
      // Look for similar field names
      let bestMatch = '';
      let bestSimilarity = 0;
      
      Object.keys(item).forEach(key => {
        const similarity = calculateStringSimilarity(key, targetField);
        if (similarity > bestSimilarity && similarity > 0.5) {
          bestSimilarity = similarity;
          bestMatch = key;
        }
      });
      
      if (bestMatch) {
        mappings[targetField] = bestMatch;
      }
    });
    
    // Handle special case for budget which might be nested
    Object.keys(item).forEach(key => {
      const normalizedKey = cleanTextForComparison(key);
      if (normalizedKey.includes('budget') && typeof item[key] === 'object') {
        mappings['budget'] = key;
      }
    });
    
    return mappings;
  }
  
  /**
   * Extract project data using field mappings
   */
  private static extractProjectData(item: any, mappings: Record<string, string>): Partial<ProjectData> {
    const projectData: Partial<ProjectData> = {};
    
    // Extract basic fields
    if (mappings.id) projectData.id = String(item[mappings.id] || '');
    if (mappings.name) projectData.name = String(item[mappings.name] || '');
    if (mappings.client) projectData.client = String(item[mappings.client] || '');
    if (mappings.progress) projectData.progress = Number(item[mappings.progress] || 0);
    if (mappings.description) projectData.description = String(item[mappings.description] || '');
    if (mappings.projectManager) projectData.projectManager = String(item[mappings.projectManager] || '');
    
    // Extract and map status field
    if (mappings.status) {
      projectData.status = mapValueToEnum(
        String(item[mappings.status] || ''),
        ['active', 'completed', 'onHold', 'atRisk'],
        'active'
      );
    }
    
    // Extract and map risk level
    if (mappings.riskLevel) {
      projectData.riskLevel = mapValueToEnum(
        String(item[mappings.riskLevel] || ''),
        ['low', 'medium', 'high'],
        'medium'
      );
    }
    
    // Extract dates
    if (mappings.startDate) projectData.startDate = extractDateValue(item[mappings.startDate]);
    if (mappings.endDate) projectData.endDate = extractDateValue(item[mappings.endDate]);
    
    // Extract numeric fields
    if (mappings.hoursWorked) projectData.hoursWorked = extractNumberValue(item[mappings.hoursWorked]);
    if (mappings.estimatedTime) projectData.estimatedTime = extractNumberValue(item[mappings.estimatedTime]);
    if (mappings.margin) projectData.margin = extractNumberValue(item[mappings.margin]);
    
    // Handle budget which might be in different formats
    if (mappings.budget && typeof item[mappings.budget] === 'object') {
      // Direct budget object
      projectData.budget = {
        used: extractNumberValue(item[mappings.budget].used),
        total: extractNumberValue(item[mappings.budget].total)
      };
    } else {
      // Try to find budget fields
      const usedBudgetKeys = ['usedBudget', 'budgetUsed', 'spentBudget', 'actualCost', 'used'];
      const totalBudgetKeys = ['totalBudget', 'budgetTotal', 'plannedBudget', 'estimatedCost', 'total'];
      
      let usedBudget = 0;
      let totalBudget = 0;
      
      // Try to find fields for budget data
      Object.keys(item).forEach(key => {
        const normalizedKey = cleanTextForComparison(key);
        
        if (usedBudgetKeys.some(budgetKey => normalizedKey.includes(cleanTextForComparison(budgetKey)))) {
          usedBudget = extractNumberValue(item[key]);
        }
        
        if (totalBudgetKeys.some(budgetKey => normalizedKey.includes(cleanTextForComparison(budgetKey)))) {
          totalBudget = extractNumberValue(item[key]);
        }
      });
      
      if (usedBudget > 0 || totalBudget > 0) {
        projectData.budget = { used: usedBudget, total: totalBudget };
      }
    }
    
    // Generate ID if not present
    if (!projectData.id) {
      projectData.id = String(Math.floor(Math.random() * 10000) + 1000);
    }
    
    return projectData;
  }
  
  /**
   * Process a task document
   */
  private static async processTaskDocument(content: any[]): Promise<DocumentProcessingResult> {
    // Extract tasks and try to find associated project
    if (Array.isArray(content) && content.length > 0) {
      // Extract project references from tasks
      const projectReferences = new Set<string>();
      const processedTasks = content.map(item => {
        // Check for project field
        const projectFields = ['project', 'projectName', 'projectId', 'project_name', 'projectKey'];
        
        projectFields.forEach(field => {
          if (item[field] && typeof item[field] === 'string') {
            projectReferences.add(item[field]);
          }
        });
        
        // Try to identify task fields
        const taskMapping = this.detectTaskFieldMappings(item);
        return this.normalizeTaskData(item, taskMapping);
      });
      
      return {
        documentType: 'task',
        confidence: 0.8,
        taskData: processedTasks,
        possibleProjects: Array.from(projectReferences).map(name => ({
          id: '', // Will be filled by UI when matching
          name,
          similarity: 1.0
        }))
      };
    }
    
    return {
      documentType: 'task',
      confidence: 0.5,
      taskData: content
    };
  }
  
  /**
   * Detect field mappings for task data
   */
  private static detectTaskFieldMappings(item: any): Record<string, string> {
    const mappings: Record<string, string> = {};
    const targetFields = [
      'id', 'title', 'description', 'status', 'priority', 'dueDate', 
      'project', 'assignee'
    ];
    
    // For each field we want to find
    targetFields.forEach(targetField => {
      // Look for an exact match first
      if (targetField in item) {
        mappings[targetField] = targetField;
        return;
      }
      
      // Look for similar field names
      let bestMatch = '';
      let bestSimilarity = 0;
      
      Object.keys(item).forEach(key => {
        const similarity = calculateStringSimilarity(key, targetField);
        if (similarity > bestSimilarity && similarity > 0.5) {
          bestSimilarity = similarity;
          bestMatch = key;
        }
      });
      
      if (bestMatch) {
        mappings[targetField] = bestMatch;
      }
    });
    
    return mappings;
  }
  
  /**
   * Normalize task data using detected mappings
   */
  private static normalizeTaskData(item: any, mappings: Record<string, string>): any {
    const task: any = {};
    
    // Extract basic fields
    if (mappings.id) task.id = String(item[mappings.id] || Math.floor(Math.random() * 10000) + 1000);
    if (mappings.title) task.title = String(item[mappings.title] || '');
    if (mappings.description) task.description = String(item[mappings.description] || '');
    if (mappings.project) task.project = String(item[mappings.project] || '');
    
    // Extract and normalize status field
    if (mappings.status) {
      task.status = mapValueToEnum(
        String(item[mappings.status] || ''),
        ['todo', 'inProgress', 'done'],
        'todo'
      );
    }
    
    // Extract and normalize priority
    if (mappings.priority) {
      task.priority = mapValueToEnum(
        String(item[mappings.priority] || ''),
        ['low', 'medium', 'high'],
        'medium'
      );
    }
    
    // Extract date
    if (mappings.dueDate) task.dueDate = extractDateValue(item[mappings.dueDate]);
    
    // Handle assignee which might be in different formats
    if (mappings.assignee) {
      const assigneeValue = item[mappings.assignee];
      
      if (typeof assigneeValue === 'string') {
        task.assignee = {
          id: '',
          name: assigneeValue,
          avatar: this.getInitialsFromName(assigneeValue)
        };
      } else if (typeof assigneeValue === 'object') {
        task.assignee = {
          id: assigneeValue.id || '',
          name: assigneeValue.name || assigneeValue.fullName || '',
          avatar: assigneeValue.avatar || this.getInitialsFromName(assigneeValue.name || '')
        };
      }
    }
    
    return task;
  }
  
  /**
   * Get initials from a name
   */
  private static getInitialsFromName(name: string): string {
    if (!name) return '';
    
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * Process a budget document
   */
  private static async processBudgetDocument(content: any[]): Promise<DocumentProcessingResult> {
    // Process budget data and return in the expected format
    if (Array.isArray(content) && content.length > 0) {
      const budgetMap: Record<string, { used: number; total: number }> = {};
      
      // Process each budget entry
      content.forEach(item => {
        // Try to extract project ID or name
        let projectIdentifier = null;
        
        // Check for project ID field
        ['projectId', 'id', 'project_id'].forEach(field => {
          if (item[field] && !projectIdentifier) {
            projectIdentifier = String(item[field]);
          }
        });
        
        // If no ID found, check for project name
        if (!projectIdentifier) {
          ['projectName', 'project', 'name', 'project_name'].forEach(field => {
            if (item[field] && !projectIdentifier) {
              projectIdentifier = String(item[field]);
            }
          });
        }
        
        // Skip if no project identifier
        if (!projectIdentifier) return;
        
        // Extract budget values
        let used = 0;
        let total = 0;
        
        // Look for budget used/spent values
        ['used', 'spent', 'actual', 'cost', 'usedBudget', 'spentBudget'].forEach(field => {
          if (field in item && !used) {
            used = extractNumberValue(item[field]);
          }
        });
        
        // Look for budget total/planned values
        ['total', 'budget', 'planned', 'estimate', 'totalBudget', 'plannedBudget'].forEach(field => {
          if (field in item && !total) {
            total = extractNumberValue(item[field]);
          }
        });
        
        // Add to budget map
        if (total > 0 || used > 0) {
          budgetMap[projectIdentifier] = { used, total };
        }
      });
      
      return {
        documentType: 'budget',
        confidence: 0.9,
        budgetData: budgetMap,
        possibleProjects: Object.keys(budgetMap).map(name => ({
          id: '', // Will be filled by UI when matching
          name,
          similarity: 1.0
        }))
      };
    }
    
    return {
      documentType: 'budget',
      confidence: 0.5,
      budgetData: {}
    };
  }
  
  /**
   * Match extracted information to existing projects
   */
  static matchToExistingProjects(
    extractedInfo: DocumentProcessingResult,
    existingProjects: ProjectData[]
  ): { projectMatches: Array<{projectId: string, name: string, similarity: number}> } {
    const matches: Array<{projectId: string, name: string, similarity: number}> = [];
    
    // If we have project data with an ID, check for direct matches
    if (extractedInfo.projectData?.id) {
      const idMatch = existingProjects.find(p => p.id === extractedInfo.projectData?.id);
      
      if (idMatch) {
        matches.push({
          projectId: idMatch.id,
          name: idMatch.name,
          similarity: 1.0
        });
      }
    }
    
    // If we have project data with a name, check for similar names
    if (extractedInfo.projectData?.name) {
      const nameMatches = existingProjects
        .filter(p => calculateStringSimilarity(p.name, extractedInfo.projectData?.name || '') > 0.6)
        .map(p => ({
          projectId: p.id,
          name: p.name,
          similarity: calculateStringSimilarity(p.name, extractedInfo.projectData?.name || '')
        }))
        .sort((a, b) => b.similarity - a.similarity);
      
      // Append name matches that aren't already in the list
      nameMatches.forEach(match => {
        if (!matches.some(m => m.projectId === match.projectId)) {
          matches.push(match);
        }
      });
    }
    
    // For task documents, check project references
    if (extractedInfo.documentType === 'task' && extractedInfo.possibleProjects) {
      extractedInfo.possibleProjects.forEach(possibleProject => {
        const projectMatches = existingProjects
          .filter(p => calculateStringSimilarity(p.name, possibleProject.name) > 0.6)
          .map(p => ({
            projectId: p.id,
            name: p.name,
            similarity: calculateStringSimilarity(p.name, possibleProject.name)
          }))
          .sort((a, b) => b.similarity - a.similarity);
        
        // Append matches that aren't already in the list
        projectMatches.forEach(match => {
          if (!matches.some(m => m.projectId === match.projectId)) {
            matches.push(match);
          }
        });
      });
    }
    
    // For budget documents, check project references
    if (extractedInfo.documentType === 'budget' && extractedInfo.possibleProjects) {
      extractedInfo.possibleProjects.forEach(possibleProject => {
        const projectMatches = existingProjects
          .filter(p => {
            // Try to match by ID first
            if (p.id === possibleProject.name) return true;
            
            // Then try by name similarity
            return calculateStringSimilarity(p.name, possibleProject.name) > 0.6;
          })
          .map(p => ({
            projectId: p.id,
            name: p.name,
            similarity: p.id === possibleProject.name ? 1.0 : calculateStringSimilarity(p.name, possibleProject.name)
          }))
          .sort((a, b) => b.similarity - a.similarity);
        
        // Append matches that aren't already in the list
        projectMatches.forEach(match => {
          if (!matches.some(m => m.projectId === match.projectId)) {
            matches.push(match);
          }
        });
      });
    }
    
    return { projectMatches: matches };
  }
}

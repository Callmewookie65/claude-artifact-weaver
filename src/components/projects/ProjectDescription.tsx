
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ProjectData } from '@/types/project';
import { Database, Save, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface ProjectDescriptionProps {
  project: ProjectData;
  updateProject?: (updatedProject: Partial<ProjectData>) => void;
}

export const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ project, updateProject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(project.description || '');
  const isImportedFromConfluence = project.description && project.description.includes("imported from Confluence");
  
  const handleSave = () => {
    if (updateProject) {
      updateProject({ description });
      toast({
        title: "Description Updated",
        description: "Project description has been updated successfully"
      });
    }
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start">
        <CardTitle className="text-xl font-semibold">Project Description</CardTitle>
        <div className="flex items-center space-x-2">
          {isImportedFromConfluence && (
            <div className="flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
              <Database className="h-3 w-3 mr-1" /> 
              <span>Imported from Confluence</span>
            </div>
          )}
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="ml-2"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSave}
              className="ml-2"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[200px]"
            placeholder="Enter project description..."
          />
        ) : (
          <>
            {description ? (
              <div className="prose max-w-none">
                {description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No description provided</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

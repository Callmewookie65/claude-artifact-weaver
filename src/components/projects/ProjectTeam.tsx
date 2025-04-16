import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { ProjectData } from '@/types/project';

interface ProjectTeamProps {
  project: ProjectData;
}

export const ProjectTeam: React.FC<ProjectTeamProps> = ({ project }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team</CardTitle>
          <CardDescription>Project team members</CardDescription>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {project.team?.map(member => (
            <div key={member.id} className="p-4 border border-gray-200 rounded-lg flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                {member.avatar}
              </div>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
          {(!project.team || project.team.length === 0) && (
            <div className="col-span-3 text-center p-4 border border-dashed rounded">
              <p className="text-muted-foreground">No team members assigned</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

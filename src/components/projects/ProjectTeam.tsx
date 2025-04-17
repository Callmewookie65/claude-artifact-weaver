
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Users, Plus, UserPlus } from 'lucide-react';
import { ProjectData, ProjectTeamMember } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface ProjectTeamProps {
  project: ProjectData;
}

export const ProjectTeam: React.FC<ProjectTeamProps> = ({ project }) => {
  const [teamMembers, setTeamMembers] = useState(project.team || []);
  const [newMember, setNewMember] = useState({ name: '', role: '', avatar: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.role) {
      toast({
        title: "Validation Error",
        description: "Name and role are required",
        variant: "destructive"
      });
      return;
    }

    const avatar = newMember.avatar || getInitials(newMember.name);
    
    const newTeamMember: ProjectTeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      role: newMember.role,
      avatar
    };

    setTeamMembers([...teamMembers, newTeamMember]);
    setNewMember({ name: '', role: '', avatar: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Team Member Added",
      description: `${newMember.name} has been added to the team`
    });
  };

  const handleDeleteMember = (id: string) => {
    const updatedTeam = teamMembers.filter(member => member.id !== id);
    setTeamMembers(updatedTeam);
    
    toast({
      title: "Team Member Removed",
      description: "Team member has been removed successfully"
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team</CardTitle>
          <CardDescription>Project team members</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="col-span-3"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Input
                  id="role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="col-span-3"
                  placeholder="Developer"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="avatar" className="text-right">
                  Initials
                </Label>
                <Input
                  id="avatar"
                  value={newMember.avatar}
                  onChange={(e) => setNewMember({...newMember, avatar: e.target.value})}
                  className="col-span-3"
                  placeholder="JD (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMember}>Add Team Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamMembers.map(member => (
            <div key={member.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between space-x-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {member.avatar}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700" 
                onClick={() => handleDeleteMember(member.id)}
              >
                Remove
              </Button>
            </div>
          ))}
          {teamMembers.length === 0 && (
            <div className="col-span-3 text-center p-4 border border-dashed rounded">
              <p className="text-muted-foreground">No team members assigned</p>
              <Button variant="link" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first team member
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

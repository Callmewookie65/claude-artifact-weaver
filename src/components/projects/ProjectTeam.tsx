
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectData, ProjectTeamMember } from '@/types/project';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Edit2, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProjectTeamProps {
  project: ProjectData;
  updateProject?: (updatedProject: Partial<ProjectData>) => void;
}

export const ProjectTeam: React.FC<ProjectTeamProps> = ({ project, updateProject }) => {
  const [team, setTeam] = useState<ProjectTeamMember[]>(project.team || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<ProjectTeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<ProjectTeamMember>>({
    name: '',
    role: '',
    avatar: ''
  });
  
  // Open member modal for editing or creating
  const openMemberModal = (member: ProjectTeamMember | null = null) => {
    if (member) {
      setCurrentMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        avatar: member.avatar
      });
    } else {
      setCurrentMember(null);
      setFormData({
        name: '',
        role: 'Developer',
        avatar: ''
      });
    }
    setIsModalOpen(true);
  };
  
  // Handle form changes
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Generate avatar from name
  const generateAvatarFromName = (name: string) => {
    if (!name) return '';
    
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Member name is required",
        variant: "destructive"
      });
      return;
    }
    
    const avatar = formData.avatar || generateAvatarFromName(formData.name);
    
    if (currentMember) {
      // Update existing member
      const updatedMember = {
        ...currentMember,
        ...formData,
        avatar
      } as ProjectTeamMember;
      
      const updatedTeam = team.map(member => 
        member.id === currentMember.id ? updatedMember : member
      );
      
      setTeam(updatedTeam);
      
      if (updateProject) {
        updateProject({ team: updatedTeam });
      }
      
      toast({
        title: "Team Member Updated",
        description: "Team member has been updated successfully"
      });
    } else {
      // Create new member
      const newMember: ProjectTeamMember = {
        id: Date.now().toString(),
        name: formData.name || '',
        role: formData.role || 'Developer',
        avatar: avatar
      };
      
      const updatedTeam = [...team, newMember];
      setTeam(updatedTeam);
      
      if (updateProject) {
        updateProject({ team: updatedTeam });
      }
      
      toast({
        title: "Team Member Added",
        description: "New team member has been added successfully"
      });
    }
    
    setIsModalOpen(false);
  };
  
  // Delete member
  const handleDelete = () => {
    if (currentMember) {
      const updatedTeam = team.filter(member => member.id !== currentMember.id);
      setTeam(updatedTeam);
      
      if (updateProject) {
        updateProject({ team: updatedTeam });
      }
      
      toast({
        title: "Team Member Removed",
        description: "Team member has been removed successfully",
        variant: "destructive"
      });
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Project Team</CardTitle>
            <CardDescription>Team members and roles</CardDescription>
          </div>
          <Button onClick={() => openMemberModal()}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map(member => (
              <div 
                key={member.id} 
                className="p-4 border border-gray-200 rounded-lg flex items-center space-x-4 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => openMemberModal(member)}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                  {member.avatar}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
            {team.length === 0 && (
              <div className="col-span-3 flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No team members added yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Team Member Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentMember ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="member-name">Name</Label>
              <Input
                id="member-name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Team member name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="member-role">Role</Label>
              <Select
                value={formData.role || 'Developer'}
                onValueChange={(value) => handleChange('role', value)}
              >
                <SelectTrigger id="member-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                  <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                  <SelectItem value="Content Manager">Content Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="member-avatar">Avatar Initials (Optional)</Label>
              <Input
                id="member-avatar"
                value={formData.avatar || ''}
                onChange={(e) => handleChange('avatar', e.target.value)}
                placeholder="e.g. JD"
                maxLength={2}
              />
              <p className="text-xs text-gray-500">
                Leave empty to generate from name
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center">
            <div>
              {currentMember && (
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {currentMember ? 'Update' : 'Add Member'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

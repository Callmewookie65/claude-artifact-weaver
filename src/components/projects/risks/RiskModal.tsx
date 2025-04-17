
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { RiskItem } from './types';

interface RiskModalProps {
  isModalOpen: boolean;
  closeRiskModal: () => void;
  currentRisk: RiskItem | null;
  projects: string[];
  onSave?: (risk: RiskItem) => void;
  onDelete?: () => void;
}

export const RiskModal: React.FC<RiskModalProps> = ({ 
  isModalOpen, 
  closeRiskModal, 
  currentRisk, 
  projects,
  onSave,
  onDelete
}) => {
  const [risk, setRisk] = useState<RiskItem>({
    id: '',
    title: '',
    description: '',
    impact: 'medium',
    probability: 'medium',
    status: 'identified',
    mitigationPlan: '',
    project: projects[0] || '',
    createdBy: 'Current User',
    createdAt: new Date().toISOString().split('T')[0]
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentRisk) {
      setRisk(currentRisk);
    } else {
      // Reset form for new risk
      setRisk({
        id: '',
        title: '',
        description: '',
        impact: 'medium',
        probability: 'medium',
        status: 'identified',
        mitigationPlan: '',
        project: projects[0] || '',
        createdBy: 'Current User',
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
  }, [currentRisk, projects]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRisk({ ...risk, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setRisk({ ...risk, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!risk.title) {
        toast({
          title: "Error",
          description: "Risk title is required",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      const riskToSave = {
        ...risk,
        id: risk.id || Date.now().toString(),
      };
      
      if (onSave) {
        onSave(riskToSave);
      }
      
      toast({
        title: currentRisk ? "Risk Updated" : "Risk Created",
        description: currentRisk ? "Changes saved successfully" : "New risk added successfully"
      });
      
      closeRiskModal();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save risk. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    
    try {
      if (onDelete) {
        onDelete();
      }
      
      toast({
        title: "Risk Deleted",
        description: "Risk has been deleted successfully",
        variant: "destructive"
      });
      
      setIsDeleteDialogOpen(false);
      closeRiskModal();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete risk. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={closeRiskModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentRisk ? 'Edit Risk' : 'Add New Risk'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={risk.title}
                onChange={handleChange}
                required
                placeholder="Risk title"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={risk.description}
                onChange={handleChange}
                placeholder="Describe the risk"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="impact">Impact</Label>
                <Select
                  value={risk.impact}
                  onValueChange={(value) => handleSelectChange('impact', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="probability">Probability</Label>
                <Select
                  value={risk.probability}
                  onValueChange={(value) => handleSelectChange('probability', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select probability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={risk.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="identified">Identified</SelectItem>
                    <SelectItem value="mitigated">Mitigated</SelectItem>
                    <SelectItem value="occurred">Occurred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="project">Project</Label>
                <Select
                  value={risk.project}
                  onValueChange={(value) => handleSelectChange('project', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project} value={project}>{project}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="mitigationPlan">Mitigation Plan</Label>
              <Textarea
                id="mitigationPlan"
                name="mitigationPlan"
                value={risk.mitigationPlan}
                onChange={handleChange}
                placeholder="How to mitigate this risk"
                rows={3}
              />
            </div>
            
            <DialogFooter className="flex justify-between items-center">
              <div>
                {currentRisk && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isSubmitting}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={closeRiskModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : currentRisk ? 'Save Changes' : 'Add Risk'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the risk from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

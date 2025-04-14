
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Risk } from '@/types/risk';

interface RiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRisk: Risk | null;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
  projects: string[];
}

export const RiskModal = ({ 
  isOpen, 
  onClose, 
  currentRisk, 
  onSave, 
  onDelete, 
  projects 
}: RiskModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white rounded-xl border-0">
        <DialogHeader>
          <DialogTitle>{currentRisk ? 'Edit Risk' : 'New Risk'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSave}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                name="title"
                defaultValue={currentRisk?.title}
                placeholder="Risk title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea
                id="description"
                name="description"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={currentRisk?.description}
                placeholder="Risk description"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="impact" className="text-sm font-medium">Impact</label>
                <select
                  id="impact"
                  name="impact"
                  className="w-full p-2 border rounded"
                  defaultValue={currentRisk?.impact || 'medium'}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="probability" className="text-sm font-medium">Probability</label>
                <select
                  id="probability"
                  name="probability"
                  className="w-full p-2 border rounded"
                  defaultValue={currentRisk?.probability || 'medium'}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <select
                  id="status"
                  name="status"
                  className="w-full p-2 border rounded"
                  defaultValue={currentRisk?.status || 'identified'}
                >
                  <option value="identified">Identified</option>
                  <option value="mitigated">Mitigated</option>
                  <option value="occurred">Occurred</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="project" className="text-sm font-medium">Project</label>
                <select
                  id="project"
                  name="project"
                  className="w-full p-2 border rounded"
                  defaultValue={currentRisk?.project}
                  required
                >
                  {projects.map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="mitigationPlan" className="text-sm font-medium">Mitigation Plan</label>
              <textarea
                id="mitigationPlan"
                name="mitigationPlan"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue={currentRisk?.mitigationPlan}
                placeholder="Describe the mitigation plan"
              />
            </div>
          </div>
          
          <DialogFooter>
            {currentRisk && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              {currentRisk ? 'Save Changes' : 'Add Risk'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

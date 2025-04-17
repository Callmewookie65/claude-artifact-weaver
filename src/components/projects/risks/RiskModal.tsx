
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RiskItem } from './types';

interface RiskModalProps {
  isModalOpen: boolean;
  closeRiskModal: () => void;
  currentRisk: RiskItem | null;
  projects: string[];
}

export const RiskModal: React.FC<RiskModalProps> = ({ isModalOpen, closeRiskModal, currentRisk, projects }) => {
  if (!isModalOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{currentRisk ? 'Edit Risk' : 'Add Risk'}</CardTitle>
          <CardDescription>
            {currentRisk ? 'Edit risk details' : 'Create a new risk entry'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label htmlFor="risk-title" className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                id="risk-title"
                className="w-full p-2 border rounded-md"
                defaultValue={currentRisk?.title}
              />
            </div>
            <div>
              <label htmlFor="risk-description" className="block text-sm font-medium mb-1">Description</label>
              <textarea
                id="risk-description"
                rows={3}
                className="w-full p-2 border rounded-md"
                defaultValue={currentRisk?.description}
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="risk-impact" className="block text-sm font-medium mb-1">Impact</label>
                <select
                  id="risk-impact"
                  className="w-full p-2 border rounded-md"
                  defaultValue={currentRisk?.impact || 'medium'}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="risk-probability" className="block text-sm font-medium mb-1">Probability</label>
                <select
                  id="risk-probability"
                  className="w-full p-2 border rounded-md"
                  defaultValue={currentRisk?.probability || 'medium'}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="risk-mitigation" className="block text-sm font-medium mb-1">Mitigation Plan</label>
              <textarea
                id="risk-mitigation"
                rows={3}
                className="w-full p-2 border rounded-md"
                defaultValue={currentRisk?.mitigationPlan}
              ></textarea>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={closeRiskModal}>Cancel</Button>
          <div className="flex gap-2">
            {currentRisk && (
              <Button variant="destructive">Delete</Button>
            )}
            <Button>{currentRisk ? 'Update' : 'Create'}</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

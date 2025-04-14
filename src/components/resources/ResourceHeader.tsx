
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Edit, PlusCircle, Filter } from 'lucide-react';
import { generateResourcesTemplate } from '@/utils/csvExport';

interface ResourceHeaderProps {
  isEditing: string | null;
  setIsEditing: (value: string | null) => void;
  filter: string;
  setFilter: (value: string) => void;
}

export const ResourceHeader = ({ 
  isEditing, 
  setIsEditing, 
  filter, 
  setFilter 
}: ResourceHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <h2 className="text-xl font-heading">Resource Directory</h2>
        <div className="ml-6 relative">
          <input
            type="text"
            placeholder="Filter resources..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9 bg-[#f9f9f9] border border-[#eee] rounded-lg py-2 px-3 text-sm w-64 focus:border-black focus:outline-none"
          />
          <Filter className="h-4 w-4 absolute left-2.5 top-2.5 text-[#777]" />
        </div>
      </div>
      
      <Button variant="ghost" onClick={() => setIsEditing(isEditing ? null : 'all')} className="text-[#777] hover:text-black">
        <Edit className="mr-2 h-4 w-4" />
        {isEditing ? 'Done Editing' : 'Edit All'}
      </Button>
    </div>
  );
};

export const ResourcePageHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="font-heading text-3xl font-bold bg-gradient-custom mb-2">
          Resources
        </h1>
        <p className="text-[#777]">Manage team members and resource allocation</p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={generateResourcesTemplate} className="border-[#eee] bg-white hover:bg-[#f5f5f5]">
          <Download className="mr-2 h-5 w-5" />
          Template
        </Button>
        <Button className="bg-black text-white hover:bg-black/90">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Resource
        </Button>
      </div>
    </div>
  );
};

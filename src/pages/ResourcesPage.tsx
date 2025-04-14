
import React from 'react';
import { useResourceManagement } from '@/hooks/useResourceManagement';
import { ResourceSummary } from '@/components/resources/ResourceSummary';
import { ResourceTable } from '@/components/resources/ResourceTable';
import { ResourceHeader, ResourcePageHeader } from '@/components/resources/ResourceHeader';

export default function ResourcesPage() {
  const { 
    resources, 
    filteredResources, 
    isEditing, 
    filter,
    setFilter, 
    setIsEditing, 
    handleResourceChange,
    getInitials,
    getResourceSummary 
  } = useResourceManagement();

  const summary = getResourceSummary();

  return (
    <div className="space-y-8">
      <ResourcePageHeader />
      <ResourceSummary summary={summary} />

      <div className="card-new overflow-hidden">
        <ResourceHeader 
          isEditing={isEditing} 
          setIsEditing={setIsEditing} 
          filter={filter} 
          setFilter={setFilter} 
        />
        
        <ResourceTable 
          filteredResources={filteredResources}
          isEditing={isEditing}
          handleResourceChange={handleResourceChange}
          getInitials={getInitials}
          resources={resources}
        />
      </div>
    </div>
  );
}

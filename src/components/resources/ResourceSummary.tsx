
import React from 'react';
import { ResourceSummary as ResourceSummaryType } from '@/types/resource';

interface ResourceSummaryProps {
  summary: ResourceSummaryType;
}

export const ResourceSummary = ({ summary }: ResourceSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="card-new">
        <h3 className="text-xl font-heading text-black mb-2">Team Size</h3>
        <p className="text-2xl font-bold">{summary.totalCount}</p>
        <p className="text-[#777] text-sm">Team members</p>
      </div>
      <div className="card-new">
        <h3 className="text-xl font-heading text-black mb-2">Roles</h3>
        <p className="text-2xl font-bold">{summary.uniqueRoles}</p>
        <p className="text-[#777] text-sm">Unique positions</p>
      </div>
      <div className="card-new">
        <h3 className="text-xl font-heading text-black mb-2">Avg. Rate</h3>
        <p className="text-2xl font-bold">{summary.avgHourlyRate.toFixed(0)} PLN</p>
        <p className="text-[#777] text-sm">Per hour</p>
      </div>
      <div className="card-new">
        <h3 className="text-xl font-heading text-black mb-2">Availability</h3>
        <p className="text-2xl font-bold">{summary.avgAvailability.toFixed(0)}%</p>
        <p className="text-[#777] text-sm">Team average</p>
      </div>
    </div>
  );
};

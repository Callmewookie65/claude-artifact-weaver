
import React from 'react';
import { Resource } from '@/types/resource';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ResourceTableProps {
  filteredResources: Resource[];
  isEditing: string | null;
  handleResourceChange: (id: string, field: keyof Resource, value: any) => void;
  getInitials: (name: string) => string;
  resources: Resource[];
}

export const ResourceTable = ({ 
  filteredResources, 
  isEditing, 
  handleResourceChange, 
  getInitials,
  resources 
}: ResourceTableProps) => {
  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f9f9f9] border-b border-[#eee]">
              <TableHead className="text-[#777]">Name</TableHead>
              <TableHead className="text-[#777]">Role</TableHead>
              <TableHead className="text-[#777] text-right">Hourly Rate</TableHead>
              <TableHead className="text-[#777] text-right">Availability</TableHead>
              <TableHead className="text-[#777]">Skills</TableHead>
              <TableHead className="text-[#777]">Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResources.map((resource) => (
              <TableRow 
                key={resource.id}
                className="border-b border-[#eee] hover:bg-[#f9f9f9]"
              >
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2 bg-[#222]">
                      <AvatarFallback className="bg-coral bg-opacity-20 text-coral">
                        {getInitials(resource.name)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing ? (
                      <input
                        type="text"
                        value={resource.name}
                        onChange={(e) => handleResourceChange(resource.id, 'name', e.target.value)}
                        className="input-new py-1 px-2 text-sm"
                      />
                    ) : (
                      <span className="font-medium">{resource.name}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <input
                      type="text"
                      value={resource.role}
                      onChange={(e) => handleResourceChange(resource.id, 'role', e.target.value)}
                      className="input-new py-1 px-2 text-sm"
                    />
                  ) : (
                    resource.role
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <input
                      type="number"
                      value={resource.hourlyRate}
                      onChange={(e) => handleResourceChange(resource.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
                      className="input-new py-1 px-2 text-sm w-20 text-right"
                    />
                  ) : (
                    `${resource.hourlyRate} PLN/h`
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <input
                      type="number"
                      value={resource.availability}
                      min="0"
                      max="100"
                      onChange={(e) => handleResourceChange(resource.id, 'availability', parseFloat(e.target.value) || 0)}
                      className="input-new py-1 px-2 text-sm w-20 text-right"
                    />
                  ) : (
                    <div>
                      <div className="text-sm">{resource.availability}%</div>
                      <div className="w-full bg-[#222] rounded-full h-1.5 mt-1">
                        <div 
                          className={`h-1.5 rounded-full ${
                            resource.availability < 30 ? 'bg-red-500' : 
                            resource.availability < 70 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`} 
                          style={{ width: `${resource.availability}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <input
                      type="text"
                      value={resource.skills.join(', ')}
                      onChange={(e) => handleResourceChange(resource.id, 'skills', e.target.value.split(',').map(s => s.trim()))}
                      className="input-new py-1 px-2 text-sm w-full"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {resource.skills.map((skill, i) => (
                        <span 
                          key={i} 
                          className="bg-[#222] px-2 py-0.5 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="email"
                        value={resource.email}
                        onChange={(e) => handleResourceChange(resource.id, 'email', e.target.value)}
                        className="input-new py-1 px-2 text-sm w-full"
                        placeholder="Email"
                      />
                      <input
                        type="tel"
                        value={resource.phone}
                        onChange={(e) => handleResourceChange(resource.id, 'phone', e.target.value)}
                        className="input-new py-1 px-2 text-sm w-full"
                        placeholder="Phone"
                      />
                    </div>
                  ) : (
                    <div className="text-sm">
                      <div className="text-[#999]">{resource.email}</div>
                      <div>{resource.phone}</div>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#eee]">
        <div className="text-sm text-[#777]">
          Showing {filteredResources.length} of {resources.length} resources
        </div>
        
        <div className="text-right">
          <p className="text-sm font-medium">
            Total capacity: <span className="text-black">
              {resources.reduce((sum, r) => sum + (r.availability / 100), 0).toFixed(1)} FTE
            </span>
          </p>
          <p className="text-sm text-[#777]">
            Average hourly rate: {resources.reduce((sum, r) => sum + r.hourlyRate, 0) / (resources.length || 1).toFixed(0)} PLN/h
          </p>
        </div>
      </div>
    </>
  );
};

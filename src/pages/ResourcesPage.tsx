import React, { useEffect, useState } from 'react';
import { generateResourcesTemplate } from '@/utils/csvExport';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Edit, PlusCircle, Filter } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Resource {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  availability: number;
  skills: string[];
  email: string;
  phone: string;
  avatar?: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  
  useEffect(() => {
    const importedData = localStorage.getItem('importedData');
    if (importedData) {
      try {
        const parsed = JSON.parse(importedData);
        if (parsed.resources && Array.isArray(parsed.resources)) {
          const processedResources = parsed.resources.map((resource: any, index: number) => ({
            id: resource.id || resource.ResourceID || `res-${index}`,
            name: resource.name || resource.Name || "Unnamed Resource",
            role: resource.role || resource.Role || "Unspecified",
            hourlyRate: parseFloat(resource.hourlyRate || resource.HourlyRate || 0),
            availability: parseFloat(resource.availability || resource.Availability || 100),
            skills: processSkills(resource.skills || resource.Skills),
            email: resource.email || resource.Email || "",
            phone: resource.phone || resource.Phone || ""
          }));
          
          setResources(processedResources);
        }
      } catch (error) {
        console.error("Failed to parse imported resource data:", error);
      }
    } else {
      setResources([
        {
          id: 'res-1',
          name: 'Jan Kowalski',
          role: 'Project Manager',
          hourlyRate: 150,
          availability: 80,
          skills: ['Leadership', 'Communication', 'Planning'],
          email: 'jan.kowalski@example.com',
          phone: '+48123456789'
        },
        {
          id: 'res-2',
          name: 'Anna Nowak',
          role: 'Designer',
          hourlyRate: 120,
          availability: 100,
          skills: ['UI', 'UX', 'Figma'],
          email: 'anna.nowak@example.com',
          phone: '+48987654321'
        },
        {
          id: 'res-3',
          name: 'Piotr Wiśniewski',
          role: 'Developer',
          hourlyRate: 130,
          availability: 60,
          skills: ['React', 'TypeScript', 'Node.js'],
          email: 'piotr.wisniewski@example.com',
          phone: '+48567891234'
        }
      ]);
    }
  }, []);

  const processSkills = (skills: any): string[] => {
    if (!skills) return [];
    
    if (typeof skills === 'string') {
      return skills.split(',').map(skill => skill.trim());
    }
    
    if (Array.isArray(skills)) {
      return skills.map(skill => typeof skill === 'string' ? skill : String(skill));
    }
    
    return [];
  };

  const handleResourceChange = (id: string, field: keyof Resource, value: any) => {
    setResources(prev => 
      prev.map(resource => {
        if (resource.id === id) {
          return { ...resource, [field]: value };
        }
        return resource;
      })
    );
  };

  const filteredResources = resources.filter(resource => {
    if (!filter) return true;
    const searchTerm = filter.toLowerCase();
    return (
      resource.name.toLowerCase().includes(searchTerm) ||
      resource.role.toLowerCase().includes(searchTerm) ||
      resource.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );
  });

  const getResourceSummary = () => {
    const roles = new Set(resources.map(r => r.role));
    const avgRate = resources.reduce((sum, r) => sum + r.hourlyRate, 0) / (resources.length || 1);
    const avgAvailability = resources.reduce((sum, r) => sum + r.availability, 0) / (resources.length || 1);
    
    return { 
      totalCount: resources.length,
      uniqueRoles: roles.size,
      avgHourlyRate: avgRate,
      avgAvailability
    };
  };

  const summary = getResourceSummary();

  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="space-y-8">
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-new">
          <h3 className="text-xl font-heading text-black mb-2">Team Size</h3>
          <p className="text-2xl font-bold">{resources.length}</p>
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

      <div className="card-new overflow-hidden">
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
              Total capacity: <span className="text-black">{resources.reduce((sum, r) => sum + (r.availability / 100), 0).toFixed(1)} FTE</span>
            </p>
            <p className="text-sm text-[#777]">
              Average hourly rate: {summary.avgHourlyRate.toFixed(0)} PLN/h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

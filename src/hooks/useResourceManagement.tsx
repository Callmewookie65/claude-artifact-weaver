
import { useState, useEffect } from 'react';
import { Resource, ResourceSummary } from '@/types/resource';

export const useResourceManagement = () => {
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

  const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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

  const getResourceSummary = (): ResourceSummary => {
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

  return {
    resources,
    filteredResources,
    isEditing,
    filter,
    setFilter,
    setIsEditing,
    handleResourceChange,
    getInitials,
    getResourceSummary
  };
};

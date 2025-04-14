
import { Input } from '@/components/ui/input';

interface RiskFiltersProps {
  filterImpact: string;
  setFilterImpact: (value: string) => void;
  filterProbability: string;
  setFilterProbability: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterProject: string;
  setFilterProject: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  projects: string[];
}

export const RiskFilters = ({
  filterImpact,
  setFilterImpact,
  filterProbability,
  setFilterProbability,
  filterStatus,
  setFilterStatus,
  filterProject,
  setFilterProject,
  searchQuery,
  setSearchQuery,
  projects
}: RiskFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <label htmlFor="search" className="block text-sm font-medium mb-1 text-[#555]">
          Search
        </label>
        <Input
          id="search"
          placeholder="Search risks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white border-[#eee] focus:border-black"
        />
      </div>
      <div>
        <label htmlFor="impact" className="block text-sm font-medium mb-1">
          Impact
        </label>
        <select
          id="impact"
          className="w-full p-2 border rounded"
          value={filterImpact}
          onChange={(e) => setFilterImpact(e.target.value)}
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="probability" className="block text-sm font-medium mb-1">
          Probability
        </label>
        <select
          id="probability"
          className="w-full p-2 border rounded"
          value={filterProbability}
          onChange={(e) => setFilterProbability(e.target.value)}
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status
        </label>
        <select
          id="status"
          className="w-full p-2 border rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="identified">Identified</option>
          <option value="mitigated">Mitigated</option>
          <option value="occurred">Occurred</option>
        </select>
      </div>
      <div>
        <label htmlFor="project" className="block text-sm font-medium mb-1">
          Project
        </label>
        <select
          id="project"
          className="w-full p-2 border rounded"
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
        >
          <option value="all">All</option>
          {projects.map(project => (
            <option key={project} value={project}>{project}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

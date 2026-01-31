import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  companies: string[];
  roles: string[];
  topics: string[];
  filterCompany: string;
  setFilterCompany: (value: string) => void;
  filterRole: string;
  setFilterRole: (value: string) => void;
  filterTopic: string;
  setFilterTopic: (value: string) => void;
  filterContactType: string;
  setFilterContactType: (value: string) => void;
  resultCount: number;
}

export function SearchBar({
  searchTerm,
  setSearchTerm,
  companies,
  roles,
  topics,
  filterCompany,
  setFilterCompany,
  filterRole,
  setFilterRole,
  filterTopic,
  setFilterTopic,
  filterContactType,
  setFilterContactType,
  resultCount
}: SearchBarProps) {
  const hasActiveFilters = filterCompany || filterRole || filterTopic || filterContactType;

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterCompany('');
    setFilterRole('');
    setFilterTopic('');
    setFilterContactType('');
  };

  return (
    <div className="space-y-4">
      {/* Main Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search by name, company, role, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-6 text-base"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>

        <Select value={filterContactType} onValueChange={setFilterContactType}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Members" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Members</SelectItem>
            <SelectItem value="alumni">Alumni Only</SelectItem>
            <SelectItem value="exec">Execs Only</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterCompany} onValueChange={setFilterCompany}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map(company => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map(role => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterTopic} onValueChange={setFilterTopic}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Topics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {topics.map(topic => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </Badge>
        {hasActiveFilters && (
          <span className="text-sm text-gray-600">
            with active filters
          </span>
        )}
      </div>
    </div>
  );
}

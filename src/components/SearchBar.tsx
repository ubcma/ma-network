import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, SlidersHorizontal } from 'lucide-react';

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
}: SearchBarProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters = [filterCompany, filterRole, filterTopic, filterContactType].some(
    (f) => f && f !== 'all'
  );

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterCompany('all');
    setFilterRole('all');
    setFilterTopic('all');
    setFilterContactType('all');
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 w-full">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--muted-ink) w-4 h-4" />
          <Input
            type="text"
            placeholder="Search by name, company, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input pr-8 min-h-10 text-sm focus-visible:ring-(--brand)/30"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-(--muted-ink) hover:text-white bg-white/10 p-0.5 rounded-xs transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          className={`glass-input hover:brightness-110 md:hidden min-h-10 px-3 flex items-center gap-2 ${hasActiveFilters ? 'bg-(--brand) text-black hover:bg-(--brand-glow)' : 'border-white/15 text-(--muted-ink)'}`}
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </Button>

        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Select value={filterContactType} onValueChange={setFilterContactType}>
            <SelectTrigger className="glass-input w-[140px] min-h-10">
              <SelectValue placeholder="All Members" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="alumni">Alumni Only</SelectItem>
              <SelectItem value="exec">Execs Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="glass-input w-[150px] min-h-10">
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map(company => <SelectItem key={company} value={company}>{company}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="glass-input w-[150px] min-h-10">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filterTopic} onValueChange={setFilterTopic}>
            <SelectTrigger className="glass-input w-[150px] min-h-10">
              <SelectValue placeholder="All Topics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map(topic => <SelectItem key={topic} value={topic}>{topic}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Integrated Desktop Clear Button */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              onClick={clearAllFilters}
              className="min-h-10 px-3 text-(--muted-ink) hover:text-white font-medium"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {showMobileFilters && (
        <div className="md:hidden mt-3 p-4 glass-panel rounded-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <Select value={filterContactType} onValueChange={setFilterContactType}>
            <SelectTrigger className="glass-input w-full"><SelectValue placeholder="All Members" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="alumni">Alumni Only</SelectItem>
              <SelectItem value="exec">Execs Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="glass-input w-full"><SelectValue placeholder="All Companies" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map(company => <SelectItem key={company} value={company}>{company}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="glass-input w-full"><SelectValue placeholder="All Roles" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filterTopic} onValueChange={setFilterTopic}>
            <SelectTrigger className="glass-input w-full"><SelectValue placeholder="All Topics" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map(topic => <SelectItem key={topic} value={topic}>{topic}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Integrated Mobile Clear Button */}
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={clearAllFilters}
              className="glass-input brightness-110 w-full border-white/15 text-(--muted-ink) mt-4"
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
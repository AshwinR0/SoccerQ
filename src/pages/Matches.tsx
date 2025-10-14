import { useState } from 'react';
import { Calendar, Filter, Search } from 'lucide-react';
import MatchCard from '@/components/cards/MatchCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Match } from '@/types';

import { useMatches } from "@/hooks/useSeasonHooks";
import Loader from '@/components/ui/Loader';

const Matches = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | Match['status']>('all');

  const { data: matches, isLoading: matchesLoading, error: matchesError } = useMatches();

  const filters = [
    { key: 'all' as const, label: 'All Matches', count: matches?.length },
    { key: 'Upcoming' as const, label: 'Upcoming', count: matches?.filter(m => m.status === 'Upcoming').length },
    { key: 'Completed' as const, label: 'Completed', count: matches?.filter(m => m.status === 'Completed').length },
    { key: 'Live' as const, label: 'Live', count: matches?.filter(m => m.status === 'Live').length }
  ];

  const filteredMatches = matches?.filter(match => {
    const matchesSearch = searchQuery === '' || 
      match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || match.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const upcomingMatches = filteredMatches?.filter(m => m.status === 'Upcoming');
  const completedMatches = filteredMatches?.filter(m => m.status === 'Completed');
  const liveMatches = filteredMatches?.filter(m => m.status === 'Live');

  if (matchesLoading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient-pitch mb-2">Matches</h1>
        <p className="text-muted-foreground">Follow all tournament fixtures and results</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="search-container p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams, venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={selectedFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.key)}
              className="flex-shrink-0"
            >
              {filter.label}
              <Badge variant="secondary" className="ml-2">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Live Matches */}
      {liveMatches?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <div className="w-3 h-3 bg-destructive rounded-full mr-2 animate-pulse"></div>
            Live Matches
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {liveMatches?.map(match => (
              <MatchCard key={match.id} match={match} featured />
            ))}
          </div>
        </section>
      )}

      {/* Completed Matches */}
      {completedMatches?.reverse().length > 0 && (selectedFilter === 'all' || selectedFilter === 'Completed') && (
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Recent Results ({completedMatches.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedMatches?.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches?.length > 0 && (selectedFilter === 'all' || selectedFilter === 'Upcoming') && (
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <Calendar className="h-5 w-5 text-primary mr-2" />
            Upcoming Matches ({upcomingMatches?.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingMatches?.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {filteredMatches?.length === 0 && (
        <div className="match-card text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No matches found</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? `No matches found for "${searchQuery}"`
              : `No ${selectedFilter === 'all' ? '' : selectedFilter.toLowerCase()} matches available`
            }
          </p>
          {(searchQuery || selectedFilter !== 'all') && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Matches;
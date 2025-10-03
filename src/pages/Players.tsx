import { useMemo, useState } from 'react';
import { Search, User, Target, Shield, Users, Hand, Zap } from 'lucide-react';
import PlayerCard from '@/components/cards/PlayerCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Player } from '@/types';

import { usePlayers } from '@/hooks/useSeasonHooks';
import { useTeams } from '@/hooks/useSeasonHooks';

const Players = () => {

  const { data: teams } = useTeams();
  const { data: players } = usePlayers();

  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<'all' | Player['position']>('all');
  const [sortBy, setSortBy] = useState<'name' | 'goals' | 'assists'>('goals');
  

  const positions = [
    { key: 'all' as const, label: 'All Positions', icon: Users },
    { key: 'Forward' as const, label: 'Forwards', icon: Zap },
    { key: 'Midfielder' as const, label: 'Midfielders', icon: Users },
    { key: 'Defender' as const, label: 'Defenders', icon: Shield },
    { key: 'Goalkeeper' as const, label: 'Goalkeepers', icon: Hand }
  ];

  const filteredAndSortedPlayers = useMemo(() => {
  return players?.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teams.find(t => t.id === player.team_id)?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPosition = positionFilter === 'all' || player.position === positionFilter;
      return matchesSearch && matchesPosition;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'goals':
          return b.goals - a.goals;
        case 'assists':
          return b.assists - a.assists;
        default:
          return 0;
      }
    });
}, [players, teams, searchQuery, positionFilter, sortBy]);

  const totalPlayers = players?.length;
  const totalGoals = players?.reduce((sum, player) => sum + player.goals, 0);
  const totalAssists = players?.reduce((sum, player) => sum + player.assists, 0);
  const topScorer = players?.reduce((top, player) => player.goals > top.goals ? player : top, players[0]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient-pitch mb-2">Players</h1>
        <p className="text-muted-foreground">Meet the stars of the tournament</p>
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="match-card text-center">
          <User className="h-8 w-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{totalPlayers}</div>
          <div className="text-sm text-muted-foreground">Total Players</div>
        </div>
        
        <div className="match-card text-center">
          <Target className="h-8 w-8 text-destructive mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{totalGoals}</div>
          <div className="text-sm text-muted-foreground">Total Goals</div>
        </div>
        
        <div className="match-card text-center">
          <Users className="h-8 w-8 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{totalAssists}</div>
          <div className="text-sm text-muted-foreground">Total Assists</div>
        </div>
        
        <div className="match-card text-center">
          <Target className="h-8 w-8 text-warning mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{topScorer?.goals || 0}</div>
          <div className="text-sm text-muted-foreground">Top Goals</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="search-container p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players, teams, locality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Position Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <span className="text-sm text-muted-foreground flex-shrink-0">Position:</span>
          {positions?.map((position) => {
            const count = players?.filter(p => position.key === 'all' || p.position === position.key).length;
            return (
              <Button
                key={position.key}
                variant={positionFilter === position.key ? "default" : "outline"}
                size="sm"
                onClick={() => setPositionFilter(position.key)}
                className="flex-shrink-0"
              >
                <position.icon className="h-4 w-4 mr-1" />
                {position.label}
                <Badge variant="secondary" className="ml-2">
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <span className="text-sm text-muted-foreground flex-shrink-0">Sort by:</span>
          {[
            { key: 'goals', label: 'Goals' },
            { key: 'assists', label: 'Assists' },
            { key: 'name', label: 'Name' }
          ]?.map((option) => (
            <Button
              key={option.key}
              variant={sortBy === option.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(option.key as 'name' | 'goals' | 'assists')}
              className="flex-shrink-0"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Players Grid */}
      {filteredAndSortedPlayers?.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedPlayers?.map((player, index) => (
            <div key={player.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <PlayerCard player={player} team={teams?.find(t => t.id === player.team_id)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="match-card text-center py-12">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No players found</h3>
          <p className="text-muted-foreground">
            {searchQuery || positionFilter !== 'all'
              ? 'No players match your current filters'
              : 'No players available at the moment'
            }
          </p>
          {(searchQuery || positionFilter !== 'all') && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setPositionFilter('all');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Position Breakdown */}
      {filteredAndSortedPlayers?.length > 0 && positionFilter === 'all' && (
        <div className="match-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Squad Breakdown</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {positions?.slice(1)?.map((position) => {
              const count = players.filter(p => p.position === position.key).length;
              const percentage = Math.round((count / totalPlayers) * 100);
              
              return (
                <div key={position.key} className="text-center">
                  <position.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-xl font-bold text-foreground">{count}</div>
                  <div className="text-sm text-muted-foreground">{position.label}</div>
                  <div className="text-xs text-muted-foreground">({percentage}%)</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Players;
import { useState } from 'react';
import { Search, Users, Trophy, TrendingUp } from 'lucide-react';
import TeamCard from '@/components/cards/TeamCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTeams } from '@/hooks/useSeasonHooks';

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'points' | 'name' | 'goals'>('points');

  const { data: teams } = useTeams();

  const filteredAndSortedTeams = teams?.filter(team =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.coach.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.stadium.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return b.points - a.points;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'goals':
          return b.goals_for - a.goals_for;
        default:
          return 0;
      }
    });

  const totalTeams = teams?.length;
  const totalGoals = teams?.reduce((sum, team) => sum + team.goals_for, 0);
  const averageGoals = totalTeams ? Math.round((totalGoals / totalTeams) * 10) / 10 : 0;
  const topTeam = teams?.reduce((top, team) => team.points > top.points ? team : top, teams[0]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient-pitch mb-2">Teams</h1>
        <p className="text-muted-foreground">Discover all participating teams and their performance</p>
      </div>

      {/* Tournament Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="match-card text-center">
          <Users className="h-8 w-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{totalTeams}</div>
          <div className="text-sm text-muted-foreground">Total Teams</div>
        </div>
        
        <div className="match-card text-center">
          <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{topTeam?.points ?? 0}</div>
          <div className="text-sm text-muted-foreground">Highest Points</div>
        </div>
        
        <div className="match-card text-center">
          <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{totalGoals}</div>
          <div className="text-sm text-muted-foreground">Total Goals</div>
        </div>
        
        <div className="match-card text-center">
          <TrendingUp className="h-8 w-8 text-warning mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{averageGoals}</div>
          <div className="text-sm text-muted-foreground">Avg Goals/Team</div>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="search-container p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams, coaches, stadiums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <span className="text-sm text-muted-foreground flex-shrink-0">Sort by:</span>
          {[
            { key: 'points', label: 'Points' },
            { key: 'name', label: 'Name' },
            { key: 'goals', label: 'Goals' }
          ].map((option) => (
            <Button
              key={option.key}
              variant={sortBy === option.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(option.key as 'points' | 'name' | 'goals')}
              className="flex-shrink-0"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Teams Grid */}
      {filteredAndSortedTeams?.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedTeams?.map((team, index) => (
            <div key={team.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <TeamCard team={team} />
            </div>
          ))}
        </div>
      ) : (
        <div className="match-card text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No teams found</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? `No teams found matching "${searchQuery}"`
              : 'No teams available at the moment'
            }
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Team Performance Insights */}
      {filteredAndSortedTeams?.length > 0 && (
        <div className="match-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tournament Insights</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-foreground mb-2">Leading Team</h4>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: topTeam?.colors.primary }}
                >
                  {topTeam?.short_name}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{topTeam?.name}</div>
                  <div className="text-sm text-muted-foreground">{topTeam?.points} points</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Best Attack</h4>
              {(() => {
                const bestAttack = teams.reduce((best, team) => 
                  team.goals_for > best.goals_for ? team : best, teams[0]
                );
                return (
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: bestAttack.colors.primary }}
                    >
                      {bestAttack.short_name}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{bestAttack.name}</div>
                      <div className="text-sm text-muted-foreground">{bestAttack.goals_for} goals scored</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
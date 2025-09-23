import { useState } from 'react';
import { Trophy, TrendingUp, Target, Shield, FileQuestionIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStandings } from "@/hooks/useSeasonHooks";

const Standings = () => {
  const { data: standings } = useStandings();
  const [view, setView] = useState<'table' | 'form'>('table');

  const getPositionStyle = (position: number) => {
    if (position === 1) return 'text-gradient-gold';
    if (position <= 3) return 'text-primary';
    return 'text-muted-foreground';
  };

  const getPositionIndicator = (position: number) => {
    if (position === 1) return '🏆';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '';
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient-pitch mb-2">League Standings</h1>
        <p className="text-muted-foreground">Current tournament table and team performance</p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center">
        <div className="search-container p-1 flex">
          <Button
            variant={view === 'table' ? "default" : "ghost"}
            size="sm"
            onClick={() => setView('table')}
          >
            League Table
          </Button>
          <Button
            variant={view === 'form' ? "default" : "ghost"}
            size="sm"
            onClick={() => setView('form')}
          >
            Team Form
          </Button>
        </div>
      </div>

      {view === 'table' && (
        <>
          {/* League Table */}
          <div className="match-card overflow-hidden">
            <div className="bg-gradient-pitch p-4 text-primary-foreground">
              <h2 className="text-xl font-bold">Tournament Table</h2>
              <p className="text-primary-foreground/80 text-sm">Current standings based on points and goal difference</p>
            </div>

            {/* Desktop Table */}
            {standings?.length > 0 ? <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="standings-row bg-muted/50">
                    <th className="text-left p-3 font-semibold">Pos</th>
                    <th className="text-left p-3 font-semibold">Team</th>
                    <th className="text-center p-3 font-semibold">P</th>
                    <th className="text-center p-3 font-semibold">W</th>
                    <th className="text-center p-3 font-semibold">D</th>
                    <th className="text-center p-3 font-semibold">L</th>
                    <th className="text-center p-3 font-semibold">GF</th>
                    <th className="text-center p-3 font-semibold">GA</th>
                    <th className="text-center p-3 font-semibold">GD</th>
                    <th className="text-center p-3 font-semibold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings?.map((standing) => (
                    <tr key={standing.team.id} className="standings-row">
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${getPositionStyle(standing.position)}`}>
                            {standing.position}
                          </span>
                          <span className="text-lg">{getPositionIndicator(standing.position)}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: standing.team.colors.primary }}
                          >
                            {standing.team.short_name}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{standing.team.name}</div>
                            <div className="text-sm text-muted-foreground">{standing.team.coach}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3 text-foreground">{standing.played}</td>
                      <td className="text-center p-3 text-success font-semibold">{standing.wins}</td>
                      <td className="text-center p-3 text-muted-foreground">{standing.draws}</td>
                      <td className="text-center p-3 text-destructive">{standing.losses}</td>
                      <td className="text-center p-3 text-foreground">{standing.goals_for}</td>
                      <td className="text-center p-3 text-foreground">{standing.goals_against}</td>
                      <td className={`text-center p-3 font-semibold ${standing.goal_difference >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {standing.goal_difference >= 0 ? '+' : ''}{standing.goal_difference}
                      </td>
                      <td className="text-center p-3 font-bold text-foreground text-lg">{standing.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> :
              <div className="match-card text-center py-12">
                <FileQuestionIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No teams found</h3>
                <p className="text-muted-foreground">
                  No teams available at the moment
                </p>
              </div>
            }

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {standings?.map((standing) => (
                <div key={standing.team.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${getPositionStyle(standing.position)}`}>
                          {standing.position}
                        </span>
                        <span>{getPositionIndicator(standing.position)}</span>
                      </div>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: standing.team.colors.primary }}
                      >
                        {standing.team.short_name}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{standing.team.name}</div>
                        <div className="text-sm text-muted-foreground">{standing.team.coach}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{standing.points}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-center text-sm">
                    <div>
                      <div className="text-foreground font-semibold">{standing.played}</div>
                      <div className="text-muted-foreground">P</div>
                    </div>
                    <div>
                      <div className="text-success font-semibold">{standing.wins}</div>
                      <div className="text-muted-foreground">W</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{standing.draws}</div>
                      <div className="text-muted-foreground">D</div>
                    </div>
                    <div>
                      <div className="text-destructive">{standing.losses}</div>
                      <div className="text-muted-foreground">L</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-sm">
                    <span className="text-muted-foreground">Goals: {standing.goals_for}-{standing.goals_against}</span>
                    <span className={`font-semibold ${standing.goal_difference >= 0 ? 'text-success' : 'text-destructive'}`}>
                      GD: {standing.goal_difference >= 0 ? '+' : ''}{standing.goal_difference}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table Legend */}
          <div className="match-card p-4">
            <h3 className="font-semibold text-foreground mb-3">Table Legend</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <span>P = Played, W = Won, D = Drawn, L = Lost</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>GF = Goals For, GA = Goals Against, GD = Goal Difference</span>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-warning" />
                  <span className="text-muted-foreground">Champion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Top 3</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {view === 'form' && (
        <div className="space-y-6">
          {/* Team Performance Analysis */}
          <div className="grid gap-6 md:grid-cols-2">
            {standings?.map((standing) => (
              <div key={standing.team.id} className="match-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: standing.team.colors.primary }}
                  >
                    {standing.team.short_name}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{standing.team.name}</h3>
                    <p className="text-sm text-muted-foreground">Position: {standing.position}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
                      <div className="font-bold text-foreground">{standing.points}</div>
                      <div className="text-xs text-muted-foreground">Points</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Target className="h-5 w-5 text-success mx-auto mb-1" />
                      <div className="font-bold text-foreground">{standing.played > 0 ? Math.round((standing.wins / standing.played) * 100) : 0}%</div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                  </div>

                  {/* Attack vs Defense */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-success" />
                        <span>Attack</span>
                      </div>
                      <span className="font-semibold">{standing.goals_for} goals</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Defense</span>
                      </div>
                      <span className="font-semibold">{standing.goals_against} conceded</span>
                    </div>
                  </div>

                  {/* Form Summary */}
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-2">Season Form</div>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <div className="text-success font-bold">{standing.wins}W</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">{standing.draws}D</div>
                      </div>
                      <div>
                        <div className="text-destructive">{standing.losses}L</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Standings;
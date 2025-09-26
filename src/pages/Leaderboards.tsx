import { useState } from 'react';
import { Target, Shield, Award, TrendingUp, FileQuestionIcon, Hand, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTopScorers } from "@/hooks/useSeasonHooks";
import { useGoldenGlove } from '@/hooks/useSeasonHooks';
import { usePlayers } from '@/hooks/useSeasonHooks';
import { useTeams } from '@/hooks/useSeasonHooks';
import PlaceholderPlayerImg from "../assets/placeholder_player.png"

const Leaderboards = () => {

  const { data: topScorers } = useTopScorers();
  const { data: goldenGlove } = useGoldenGlove();
  const { data: teams } = useTeams();
  const { data: players } = usePlayers();

  type TabKey = 'scorers' | 'assists' | 'keepers';
  const [activeTab, setActiveTab] = useState<TabKey>('scorers');

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'scorers', label: 'Top Scorers', icon: Zap },
    { key: 'assists', label: 'Most Assists', icon: Award },
    { key: 'keepers', label: 'Golden Glove', icon: Hand }
  ];

  // Calculate assists leaderboard
  const assistsLeaderboard = players?.filter(p => p.assists > 0)?.sort((a, b) => b.assists - a.assists)
    ?.slice(0, 10)
    ?.map((player, index) => ({
      rank: index + 1,
      player,
      team: teams?.find(t => t.id === player.team_id),
      assists: player.assists,
      goals: player.goals
    }));

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'text-gradient-gold';
    if (rank === 2) return 'text-accent';
    if (rank === 3) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient-pitch mb-2">Leaderboards</h1>
        <p className="text-muted-foreground">Tournament's top performing players</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="search-container p-1 flex space-x-1">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.key)}
              // onClick={() => setActiveTab(tab.key as any)}
              className="flex items-center space-x-2"
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Top Scorers */}
      {activeTab === 'scorers' && (
        <div className="space-y-6">
          <div className="match-card overflow-hidden">
            <div className="bg-gradient-pitch from-destructive to-destructive/80 p-4 text-destructive-foreground">
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6" />
                <h2 className="text-xl font-bold">Top Goal Scorers</h2>
              </div>
              <p className="text-destructive-foreground/80 text-sm">Players with the most goals this tournament</p>
            </div>

            {/* Top 3 Highlight */}
            {topScorers?.length > 0 ? <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/10">
              <div className="grid md:grid-cols-3 gap-6">
                {topScorers?.slice(0, 3).map((scorer) => (
                  <div key={scorer.player.id} className="text-center">
                    <div className="relative inline-block mb-3">
                      <img
                        src={scorer.player.profile_photo_url || PlaceholderPlayerImg}
                        alt={scorer.player.name}
                        className="w-32 h-32 object-contain mx-auto"
                        onError={e => {
                        const target = e.currentTarget;
                        if (target.src !== window.location.origin + PlaceholderPlayerImg) {
                          target.src = PlaceholderPlayerImg;
                        }
                      }}
                        
                      />
                      <div className="absolute top-5 right-2 text-2xl">
                        {getRankIcon(scorer.rank)}
                      </div>
                    </div>
                    <h3 className={`text-xl font-bold ${getRankStyle(scorer.rank)}`}>
                      #{scorer.rank}
                    </h3>
                    <p className="font-semibold text-lg text-foreground">{scorer.player.name}</p>
                    <p className="text-sm text-muted-foreground">{scorer?.team?.name}</p>
                    <div className="mt-2 space-y-1">
                      <div className="text-2xl font-bold text-foreground">{scorer.goals}</div>
                      <div className="text-sm text-muted-foreground">Goals</div>
                      <div className="text-sm text-muted-foreground">{scorer.assists} Assists</div>
                    </div>
                  </div>
                ))}
              </div>
            </div> :
              <div className="match-card text-center py-12">
                <FileQuestionIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No stats found</h3>
                <p className="text-muted-foreground">
                  No stats available at the moment
                </p>
              </div>
            }

            {/* Full Rankings */}
            {topScorers?.length > 0 && <div className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Complete Rankings</h3>
              <div className="space-y-3">
                {topScorers?.map((scorer) => (
                  <div key={scorer.player.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className={`font-bold ${getRankStyle(scorer.rank)}`}>
                        {scorer.rank}
                      </span>
                      <span className="ml-1">{getRankIcon(scorer.rank)}</span>
                    </div>

                    <img
                      src={scorer.player.profile_photo_url || PlaceholderPlayerImg}
                      alt={scorer.player.name}
                      className="w-14 h-14 object-contain"
                      onError={e => {
                        const target = e.currentTarget;
                        if (target.src !== window.location.origin + PlaceholderPlayerImg) {
                          target.src = PlaceholderPlayerImg;
                        }
                      }}
                    />

                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{scorer.player.name}</div>
                      <div className="text-sm text-muted-foreground">{scorer?.team?.name} • {scorer.player.position}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">{scorer.goals}</div>
                      <div className="text-xs text-muted-foreground">goals</div>
                    </div>

                    <div className="text-right text-sm text-muted-foreground">
                      <div>{scorer.assists} assists</div>
                      <div>{scorer.player.appearances} apps</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>}
          </div>
        </div>
      )}

      {/* Most Assists */}
      {activeTab === 'assists' && (
        <div className="space-y-6">
          <div className="match-card overflow-hidden">
            <div className="bg-gradient-pitch from-accent to-accent/80 p-4 text-destructive-foreground">
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6" />
                <h2 className="text-xl font-bold">Most Assists</h2>
              </div>
              <p className="text-destructive-foreground text-sm">Players creating the most scoring opportunities</p>
            </div>

            {assistsLeaderboard?.length > 0 ? <div className="p-4">
              <div className="space-y-3">
                {assistsLeaderboard?.map((player) => (
                  <div key={player.player.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className={`font-bold ${getRankStyle(player.rank)}`}>
                        {player.rank}
                      </span>
                      <span className="ml-1">{getRankIcon(player.rank)}</span>
                    </div>

                    <img
                      src={player.player.profile_photo_url || PlaceholderPlayerImg}
                      alt={player.player.name}
                      className="w-20 h-20 object-contain"
                      onError={e => {
                        const target = e.currentTarget;
                        if (target.src !== window.location.origin + PlaceholderPlayerImg) {
                          target.src = PlaceholderPlayerImg;
                        }
                      }}
                    />

                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{player.player.name}</div>
                      <div className="text-sm text-muted-foreground">{player.team.name} • {player.player.position}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">{player.assists}</div>
                      <div className="text-xs text-muted-foreground">assists</div>
                    </div>

                    <div className="text-right text-sm text-muted-foreground">
                      <div>{player.goals} goals</div>
                      <div>{player.player.appearances} apps</div>
                    </div>
                  </div>
                ))}
              </div>
            </div> :
              <div className="match-card text-center py-12">
                <FileQuestionIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No stats found</h3>
                <p className="text-muted-foreground">
                  No stats available at the moment
                </p>
              </div>
            }
          </div>
        </div>
      )}

      {/* Golden Glove */}
      {activeTab === 'keepers' && (
        <div className="space-y-6">
          <div className="match-card overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-glow p-4 text-primary-foreground">
              <div className="flex items-center space-x-2">
                <Hand className="h-6 w-6" />
                <h2 className="text-xl font-bold">Golden Glove</h2>
              </div>
              <p className="text-primary-foreground/80 text-sm">Top performing goalkeepers this tournament</p>
            </div>

            {goldenGlove?.length > 0 ? <div className="p-4">
              <div className="space-y-3">
                {goldenGlove?.map((keeper) => (
                  <div key={keeper.player.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <span className={`font-bold ${getRankStyle(keeper.rank)}`}>
                        {keeper.rank}
                      </span>
                      <span className="ml-1">{getRankIcon(keeper.rank)}</span>
                    </div>

                    <img
                      src={keeper.player.profile_photo_url || PlaceholderPlayerImg}
                      alt={keeper?.player?.name}
                      className="w-16 h-16 object-contain"
                      onError={e => {
                        const target = e.currentTarget;
                        if (target.src !== window.location.origin + PlaceholderPlayerImg) {
                          target.src = PlaceholderPlayerImg;
                        }
                      }}
                    />

                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{keeper.player.name}</div>
                      <div className="text-sm text-muted-foreground">{keeper?.team?.name} • Goalkeeper</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">{keeper.saves}</div>
                      <div className="text-xs text-muted-foreground">saves</div>
                    </div>

                    <div className="text-right text-sm text-muted-foreground">
                      <div>{keeper.clean_sheets} clean sheets</div>
                      <div>{keeper.player.appearances} apps</div>
                    </div>
                  </div>
                ))}
              </div>
            </div> :
              <div className="match-card text-center py-12">
                <FileQuestionIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No stats found</h3>
                <p className="text-muted-foreground">
                  No stats available at the moment
                </p>
              </div>
            }
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="match-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Tournament Statistics</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {players?.reduce((sum, p) => sum + p.goals, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Goals</div>
          </div>

          <div className="text-center">
            <Award className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {players?.reduce((sum, p) => sum + p.assists, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Assists</div>
          </div>

          <div className="text-center">
            <Shield className="h-8 w-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {players?.filter(p => p.clean_sheets).reduce((sum, p) => sum + (p.clean_sheets || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Clean Sheets</div>
          </div>

          <div className="text-center">
            <Target className="h-8 w-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {(Math.round((players?.reduce((sum, p) => sum + p.goals, 0) / players?.reduce((sum, p) => sum + p.appearances, 0)) * 100) / 100) || 0}
            </div>
            <div className="text-sm text-muted-foreground">Goals per Game</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;
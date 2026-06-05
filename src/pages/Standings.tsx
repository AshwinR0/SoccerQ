import { useState } from 'react';
import { Trophy, TrendingUp, Target, Shield, FileQuestionIcon, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import trophySvg from '@/assets/trophy-svgrepo-com.svg';
import { useStandings, useMatches } from "@/hooks/useSeasonHooks";
import { useSeasonContext } from '@/contexts/SeasonContext';
import MatchCard from '@/components/cards/MatchCard';
import Loader from '@/components/ui/Loader';

const Standings = () => {
  const { data: standings, isLoading: standingsLoading, error: standingsError } = useStandings();
  const { data: matches, isLoading: matchesLoading } = useMatches();
  const { currentSeason } = useSeasonContext();
  const [view, setView] = useState<'table' | 'form'>('table');

  const tournamentType = currentSeason?.type || 'LEAGUE';

  console.log(currentSeason, tournamentType);

  const getPositionStyle = (position: number) => {
    if (tournamentType === 'LEAGUE_KNOCKOUT') {
      if (position === 1) return 'text-success';
      if (position <= 3) return 'text-primary';
      return 'text-muted-foreground';
    }
    if (position === 1) return 'text-gradient-gold';
    if (position <= 3) return 'text-primary';
    return 'text-muted-foreground';
  };

  const getPositionIndicator = (position: number) => {
    if (tournamentType === 'LEAGUE_KNOCKOUT') {
      if (position === 1) return '⭐';
      if (position <= 3) return 'Q';
      return '';
    }
    if (position === 1) return '🏆';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '';
  };

  const top1 = standings?.find(s => s.position === 1)?.team;
  const top2 = standings?.find(s => s.position === 2)?.team;
  const top3 = standings?.find(s => s.position === 3)?.team;

  const finalMatch = matches?.find(m => m.stage?.toLowerCase() === 'final');
  const qualifierMatch = matches?.find(m => ['qualifier', 'knockout', 'eliminator'].includes(m.stage?.toLowerCase() || ''));

  let qualifierWinnerName = 'TBD';
  if (qualifierMatch && qualifierMatch.status === 'Completed') {
    if ((qualifierMatch.home_score || 0) > (qualifierMatch.away_score || 0)) {
      qualifierWinnerName = qualifierMatch.homeTeam?.short_name || 'TBD';
    } else {
      qualifierWinnerName = qualifierMatch.awayTeam?.short_name || 'TBD';
    }
  } else if (finalMatch) {
    const finalTeam1 = finalMatch.homeTeam?.short_name;
    const finalTeam2 = finalMatch.awayTeam?.short_name;
    qualifierWinnerName = (finalTeam1 !== top1?.short_name ? finalTeam1 : finalTeam2) || 'TBD';
  }

  let finalWinnerName = null;
  if (finalMatch && finalMatch.status === 'Completed') {
    if ((finalMatch.home_score || 0) > (finalMatch.away_score || 0)) {
      finalWinnerName = finalMatch.homeTeam?.name;
    } else {
      finalWinnerName = finalMatch.awayTeam?.name;
    }
  }

  const renderPlayoffBracket = () => {
    if (tournamentType !== 'LEAGUE_KNOCKOUT') return null;

    return (
      <div className="mt-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-foreground mb-2">Playoff Road to Final</h2>
          <p className="text-muted-foreground">The journey to the championship</p>
        </div>

        {/* Mobile & Desktop Responsive Container */}
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-12 items-center justify-center w-full max-w-6xl mx-auto px-2 lg:px-4">

          {/* Path 2: Final Match (Middle for mobile) */}
          <div className="w-full lg:w-5/12 flex flex-col gap-1 lg:gap-4 order-2 lg:order-2">
            <div className="text-center font-bold text-[10px] lg:text-sm text-warning tracking-widest mb-0 lg:mb-2 uppercase">The Grand Final</div>

            <div className="relative bg-gradient-to-b from-amber-50 to-orange-100 dark:from-warning/20 dark:to-warning/5 backdrop-blur-md border-2 border-warning/40 dark:border-warning/50 rounded-2xl lg:rounded-3xl p-4 lg:p-8 shadow-xl shadow-warning/20 dark:shadow-[0_0_40px_rgba(234,179,8,0.15)] flex flex-col items-center justify-center min-h-[150px] lg:min-h-[320px] group overflow-hidden">

              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-warning/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {/* <Trophy className="w-12 h-12 lg:w-24 lg:h-24 text-warning mb-2 lg:mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] transform group-hover:scale-110 transition-transform duration-500" /> */}

              {/* make this aligned to center */}
              <div className="flex items-center justify-center ">
                <img src={trophySvg} alt="Trophy" className="w-12 h-12 lg:w-24 lg:h-24 text-warning mb-2 lg:mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] transform group-hover:scale-110 transition-transform duration-500" />
              </div>

              <h3 className="text-[10px] lg:text-sm font-bold text-warning mb-0.5 lg:mb-1 uppercase tracking-widest">CHAMPION</h3>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-500 to-yellow-700 dark:from-yellow-300 dark:to-yellow-600 mb-4 lg:mb-8 tracking-widest drop-shadow-sm text-center">
                {finalWinnerName ? finalWinnerName : 'TBD'}
              </h2>

              <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-2 lg:gap-4 bg-white/90 dark:bg-background/80 p-3 lg:p-5 rounded-xl lg:rounded-2xl border border-warning/30 shadow-sm dark:shadow-inner relative z-10 backdrop-blur-md">
                <div className="flex flex-col items-center text-center">
                  <div className="text-[8px] lg:text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5 lg:mb-1 font-bold">Qualifier</div>
                  <div className="font-bold text-sm lg:text-lg text-foreground leading-tight truncate w-full px-1">{qualifierWinnerName}</div>
                </div>

                <div className="text-warning font-black italic text-lg lg:text-2xl drop-shadow-sm px-1">VS</div>

                <div className="flex flex-col items-center text-center">
                  <div className="text-[8px] lg:text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5 lg:mb-1 font-bold">League Leader</div>
                  <div className="font-bold text-sm lg:text-lg text-foreground leading-tight truncate w-full px-1">{top1?.short_name || '1st Place'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Path 1: Eliminator / Qualifier (Bottom for mobile) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-1 lg:gap-4 order-3 lg:order-1 relative">

            {/* Flow Arrow (Mobile Up, Desktop Right) */}
            <div className="flex justify-center items-center h-8 lg:h-12 lg:absolute lg:top-[58%] lg:-right-10 lg:-translate-y-1/2 lg:h-auto order-first lg:order-none z-20">
              <div className="flex items-center justify-center bg-primary/10 rounded-full p-1.5 lg:p-3 animate-pulse">
                {/* Mobile UP arrow */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary lg:hidden"><path d="M12 19V5" /><path d="m5 12 7-7 7 7" /></svg>
                {/* Desktop RIGHT arrow */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary hidden lg:block"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </div>
            </div>

            <div className="text-center font-bold text-[10px] lg:text-sm text-primary tracking-widest mb-0 lg:mb-2 uppercase">The Qualifier</div>

            <div className="relative bg-white dark:bg-card/40 backdrop-blur-md border border-border/50 rounded-xl lg:rounded-2xl p-3 lg:p-6 shadow-xl dark:shadow-lg overflow-hidden group min-h-[90px] lg:min-h-[260px] flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-2 lg:p-4 opacity-10 pointer-events-none">
                <Trophy className="w-16 h-16 lg:w-24 lg:h-24 text-primary" />
              </div>

              {/* Layout for 2nd and 3rd place */}
              <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center w-full gap-2 lg:gap-0">
                {/* 2nd Place */}
                <div className="flex flex-col items-center p-2 lg:p-4 bg-gray-50/80 dark:bg-background/60 rounded-lg lg:rounded-xl border border-border/50 transition-transform group-hover:scale-[1.02] shadow-sm relative z-10 w-full lg:w-auto flex-1">
                  <div className="text-[8px] lg:text-xs text-muted-foreground font-semibold tracking-wider mb-0.5 lg:mb-1">2ND PLACE</div>
                  <div className="font-bold text-sm lg:text-lg text-foreground text-center truncate w-full">{top2?.name || 'TBD'}</div>
                </div>

                <div className="flex justify-center items-center my-1 lg:my-3 relative z-10 shrink-0">
                  <div className="px-1.5 lg:px-3 py-0.5 lg:py-1 bg-primary/10 text-primary rounded-full text-[10px] lg:text-xs font-black italic border border-primary/20">VS</div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center p-2 lg:p-4 bg-gray-50/80 dark:bg-background/60 rounded-lg lg:rounded-xl border border-border/50 transition-transform group-hover:scale-[1.02] shadow-sm relative z-10 w-full lg:w-auto flex-1">
                  <div className="text-[8px] lg:text-xs text-muted-foreground font-semibold tracking-wider mb-0.5 lg:mb-1">3RD PLACE</div>
                  <div className="font-bold text-sm lg:text-lg text-foreground text-center truncate w-full">{top3?.name || 'TBD'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Path 3: Direct to Final (Top for mobile) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-1 lg:gap-4 order-1 lg:order-3 relative">

            {/* Flow Arrow (Mobile Down, Desktop Left) */}
            <div className="flex justify-center items-center h-8 lg:h-12 lg:absolute lg:top-[58%] lg:-left-10 lg:-translate-y-1/2 lg:h-auto order-last lg:order-none z-20">
              <div className="flex items-center justify-center bg-success/10 rounded-full p-1.5 lg:p-3 animate-pulse">
                {/* Mobile DOWN Arrow */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success lg:hidden"><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
                {/* Desktop LEFT Arrow */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success hidden lg:block"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
              </div>
            </div>

            <div className="text-center font-bold text-[10px] lg:text-sm text-success tracking-widest mb-0 lg:mb-2 uppercase">Direct Qualification</div>

            <div className="bg-white dark:bg-card/40 backdrop-blur-md border border-border/50 rounded-xl lg:rounded-2xl p-3 lg:p-6 shadow-xl dark:shadow-lg flex flex-col items-center justify-center min-h-[70px] lg:min-h-[260px] group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-2 lg:p-4 opacity-10 pointer-events-none">
                <Target className="w-16 h-16 lg:w-24 lg:h-24 text-success" />
              </div>

              <div className="bg-success/10 text-success text-[8px] lg:text-xs font-bold px-2 lg:px-3 py-1 lg:py-1.5 rounded-full mb-2 lg:mb-6 uppercase tracking-wider border border-success/20 text-center relative z-10 shadow-sm w-fit">
                Directly Moves to Final
              </div>

              <div className="flex flex-row lg:flex-col items-center justify-center p-3 lg:p-6 bg-gray-50/80 dark:bg-background/60 rounded-lg lg:rounded-xl border border-border/50 w-full transition-transform group-hover:scale-[1.02] shadow-sm relative z-10">
                <div className="text-[8px] lg:text-xs text-warning font-bold tracking-wider mb-0 lg:mb-2 flex items-center lg:mr-0 mr-2">
                  <Trophy className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-1.5" />
                  1ST PLACE
                </div>
                <div className="font-bold text-sm lg:text-2xl text-foreground text-center truncate">{top1?.name || 'TBD'}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  if (standingsLoading || (tournamentType === 'KNOCKOUT' && matchesLoading)) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient-pitch mb-2">
          {tournamentType === 'KNOCKOUT' ? 'Tournament Bracket' : 'League Standings'}
        </h1>
        <p className="text-muted-foreground">
          {tournamentType === 'KNOCKOUT'
            ? 'Knockout matches and results'
            : 'Current tournament table and team performance'}
        </p>
      </div>

      {/* View Toggle */}
      {tournamentType !== 'KNOCKOUT' && (
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
      )}

      {view === 'table' && tournamentType !== 'KNOCKOUT' && (
        <div className="flex flex-col space-y-8">

          {/* Conditional rendering: Playoff Bracket ABOVE League Table if inactive */}
          {currentSeason?.is_active === false && renderPlayoffBracket()}

          <div>
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
            <div className="match-card p-4 mt-6">
              <h3 className="font-semibold text-foreground mb-3">Table Legend</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span>P = Played, W = Won, D = Drawn, L = Lost</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>GF = Goals For, GA = Goals Against, GD = Goal Difference</span>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  {tournamentType === 'LEAGUE_KNOCKOUT' ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className="text-success font-bold text-lg">⭐</span>
                        <span className="text-muted-foreground">Advances to Final</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-muted-foreground">Advances to Eliminator</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-warning" />
                        <span className="text-muted-foreground">Champion</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-muted-foreground">Top 3</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Conditional rendering: Playoff Bracket BELOW League Table if active */}
          {currentSeason?.is_active !== false && renderPlayoffBracket()}

        </div>
      )}

      {view === 'table' && tournamentType === 'KNOCKOUT' && (
        <div className="space-y-6">
          <div className="match-card p-6 text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Knockout Tournament</h2>
            <p className="text-muted-foreground mb-6">This is a pure knockout tournament. Teams are eliminated upon losing a match.</p>
          </div>
          {matches && matches.length > 0 ? (
            <div className="space-y-8 mt-6">
              {Array.from(new Set(matches.map(m => m.stage))).map(stage => (
                <div key={stage}>
                  <h3 className="text-xl font-bold text-foreground mb-4">{stage}</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {matches.filter(m => m.stage === stage).map(match => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground border border-border rounded-lg">
              No knockout matches scheduled yet.
            </div>
          )}
        </div>
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
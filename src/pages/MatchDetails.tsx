import { useMemo, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Match } from '@/types';
import PlaceholderPlayerImg from '@/assets/placeholder_player.png';
import { useMatch, useMatchEvents, useMatchScorers } from '@/hooks/useSeasonHooks';
import { useTeamPlayers } from '@/hooks/useSeasonHooks';

const MatchDetails = () => {
    const { matchId } = useParams();
    const [activeTab, setActiveTab] = useState<'lineups' |'timeline' | 'stats'>('lineups');

    // Use centralized hooks (useSupabaseQuery) — they will handle fetching and caching.
    const { data: match, isLoading: matchLoading } = useMatch(matchId);
    const { data: rawEvents, isLoading: eventsLoading } = useMatchEvents(matchId);
    const { data: rawScorers, isLoading: scorersLoading } = useMatchScorers(matchId);

    const loading = !!(matchLoading || eventsLoading || scorersLoading);

    // fetch players for each team
    const getTeamId = (t: unknown, fallback?: string | undefined) => {
        if (!t) return fallback;
        const rec = t as Record<string, unknown>;
        const id = rec['id'] ?? rec['team_id'] ?? rec['teamId'];
        return id ? String(id) : fallback;
    };

    const homeTeamId = match ? getTeamId(match.homeTeam, typeof match.home_team_id === 'string' ? match.home_team_id : undefined) : undefined;
    const awayTeamId = match ? getTeamId(match.awayTeam, typeof match.away_team_id === 'string' ? match.away_team_id : undefined) : undefined;
    const { data: homePlayersRaw } = useTeamPlayers(homeTeamId);
    const { data: awayPlayersRaw } = useTeamPlayers(awayTeamId);

    const castPlayers = (arr: unknown): Array<Record<string, unknown>> => (Array.isArray(arr) ? (arr as Array<Record<string, unknown>>) : []);
    const homePlayers = castPlayers(homePlayersRaw).map((r) => ({
        id: String(r['id'] ?? r['player_id'] ?? ''),
        name: String(r['name'] ?? r['full_name'] ?? r['player_name'] ?? ''),
        number: r['jersey_number'] ?? r['shirt_number'] ?? r['number'] ?? r['squad_number'] ?? undefined,
    }));
    const awayPlayers = castPlayers(awayPlayersRaw).map((r) => ({
        id: String(r['id'] ?? r['player_id'] ?? ''),
        name: String(r['name'] ?? r['full_name'] ?? r['player_name'] ?? ''),
        number: r['jersey_number'] ?? r['shirt_number'] ?? r['number'] ?? r['squad_number'] ?? undefined,
    }));

    const inferFormation = (count: number) => {
        // Very small heuristic mapping based on player count
        if (count >= 11) return '4-4-2';
        if (count === 10) return '4-3-3';
        if (count === 9) return '3-4-2';
        if (count === 8) return '3-4-1';
        if (count === 7) return '3-3-1';
        return `${Math.max(1, count)}-unknown`;
    };

    // Lightweight local interfaces for rendering
    interface MatchEvent {
        id: number;
        match_id: string;
        event: string;
        minute: number;
        team_id: string;
        player?: { id: string; name?: string } | null;
        assist_player?: { id: string; name?: string } | null;
    }

    interface MatchScorer {
        id: number;
        match_id: string;
        minute: number;
        type?: string;
        player?: { id: string; player_profile?: { id: string; name?: string } } | null;
    }

    // Normalize raw data from hooks — memoized so it doesn't cause re-renders/loops.
    const events: MatchEvent[] = useMemo(() => {
        if (!Array.isArray(rawEvents)) return [];
        return rawEvents.map((r: unknown) => {
            const rec = r as Record<string, unknown>;
            const playerRaw = rec['player'];
            let player = null;
            if (playerRaw) {
                if (Array.isArray(playerRaw)) {
                    const first = playerRaw[0] as Record<string, unknown> | undefined;
                    if (first) player = { id: String(first['id'] as string | number), name: first['name'] as string | undefined };
                } else {
                    const p = playerRaw as Record<string, unknown>;
                    player = { id: String(p['id'] as string | number), name: p['name'] as string | undefined };
                }
            }

            const assistRaw = rec['assist_player'];
            let assist_player = null;
            if (assistRaw) {
                if (Array.isArray(assistRaw)) {
                    const first = assistRaw[0] as Record<string, unknown> | undefined;
                    if (first) assist_player = { id: String(first['id'] as string | number), name: first['name'] as string | undefined };
                } else {
                    const p = assistRaw as Record<string, unknown>;
                    assist_player = { id: String(p['id'] as string | number), name: p['name'] as string | undefined };
                }
            }

            return {
                id: Number(rec['id'] as number),
                match_id: String(rec['match_id'] as string | number),
                event: String(rec['event'] as string ?? ''),
                minute: Number(rec['minute'] as number ?? 0),
                team_id: String(rec['team_id'] as string ?? ''),
                player,
                assist_player,
            } as MatchEvent;
        });
    }, [rawEvents]);

    const scorers: MatchScorer[] = useMemo(() => {
        if (!Array.isArray(rawScorers)) return [];
        return rawScorers.map((r: unknown) => {
            const rec = r as Record<string, unknown>;
            const playerRaw = rec['player'];
            let player = null;
            if (playerRaw) {
                const first = Array.isArray(playerRaw) ? (playerRaw[0] as Record<string, unknown> | undefined) : (playerRaw as Record<string, unknown>);
                if (first) {
                    const profileRaw = first['player_profile'] ?? (first['player_profile_id'] ? { id: first['player_profile_id'] } : undefined);
                    const profile = profileRaw ? { id: String((profileRaw as Record<string, unknown>)['id'] as string | number), name: (profileRaw as Record<string, unknown>)['name'] as string | undefined } : undefined;
                    player = { id: String(first['id'] as string | number), player_profile: profile };
                }
            }
            return {
                id: Number(rec['id'] as number),
                match_id: String(rec['match_id'] as string | number),
                minute: Number(rec['minute'] as number ?? 0),
                type: String(rec['type'] as string ?? ''),
                player,
            } as MatchScorer;
        });
    }, [rawScorers]);

    const allPlayers = useMemo(() => {
        const cast = (arr: unknown): Array<Record<string, unknown>> => (Array.isArray(arr) ? (arr as Array<Record<string, unknown>>) : []);
        return [...cast(homePlayersRaw), ...cast(awayPlayersRaw)];
    }, [homePlayersRaw, awayPlayersRaw]);

    const findPlayerDetails = useCallback((profileId: string | undefined) => {
        if (!profileId) return undefined;
        return allPlayers.find(p => String(p['player_id'] || p['id']) === profileId);
    }, [allPlayers]);

    const processedEvents = useMemo(() => {
        if (!match || !match.homeTeam || !match.awayTeam) return [];
        let homeScore = 0;
        let awayScore = 0;
        
        // Sort events chronologically to compute running scores
        const sorted = [...events].sort((a, b) => a.minute - b.minute);

        return sorted.map((e) => {
            const isHome = e.team_id === match.home_team_id || e.team_id === match.homeTeam.id;
            
            // Determine score change
            if (e.event === 'Goal' || e.event === 'Penalty Goal') {
                if (isHome) homeScore++;
                else awayScore++;
            } else if (e.event === 'Own Goal') {
                if (isHome) homeScore++;
                else awayScore++;
            }

            const shortScoreStr = `${match.homeTeam.short_name} ${homeScore} - ${awayScore} ${match.awayTeam.short_name}`;

            // Generate a natural commentary description
            let description = '';
            const playerName = e.player?.name || 'Unknown Player';
            const assistName = e.assist_player?.name;
            const teamName = isHome ? match.homeTeam.name : match.awayTeam.name;
            const opponentTeamName = isHome ? match.awayTeam.name : match.homeTeam.name;

            if (e.event === 'Goal') {
                description = `${teamName} take the lead to make it ${homeScore} - ${awayScore} thanks to a clinical finish from ${playerName}.`;
                if (assistName) {
                    description += ` Beautifully set up by ${assistName}.`;
                }
                if (homeScore === awayScore) {
                    description = `${playerName} equalizes for ${teamName} to make it ${homeScore} - ${awayScore}!`;
                    if (assistName) description += ` Assisted by ${assistName}.`;
                }
            } else if (e.event === 'Penalty Goal') {
                description = `${playerName} coolly converts from the penalty spot to make it ${homeScore} - ${awayScore} for ${teamName}.`;
            } else if (e.event === 'Own Goal') {
                description = `Disaster for ${opponentTeamName}! ${playerName} accidentally puts the ball into their own net, gifting a goal to ${teamName} (${homeScore} - ${awayScore}).`;
            } else if (e.event === 'Yellow Card') {
                description = `${playerName} receives a yellow card from the referee for a tactical foul.`;
            } else if (e.event === 'Red Card') {
                description = `Red card! ${playerName} is sent off for a serious challenge, leaving ${teamName} down to 10 men.`;
            } else if (e.event === 'Penalty Miss') {
                description = `Penalty missed! ${playerName} fails to convert from 12 yards, a huge letdown for ${teamName}.`;
            }

            return {
                ...e,
                homeScore,
                awayScore,
                shortScoreStr,
                description
            };
        });
    }, [events, match]);

    // Helpers for lineup rendering
    const parseFormation = (formation: string) => formation.split('-').map((s) => Number(s) || 0);

    type Player = { id: string; name: string; number?: unknown };
    const buildLineupRows = (players: Player[], formation: string) => {
        // New fixed layout per request:
        // - Top row: up to 3 players
        // - Second row: up to 2 players
        // - Third row: remaining field players
        // - Bottom row: goalkeeper (if present)
        const rows: Player[][] = [];
        const keeper = players.length > 0 ? players[0] : undefined;
        const fieldPlayers = players.length > 0 ? players.slice(1) : [];

        const top = fieldPlayers.slice(0, 2);
        const second = fieldPlayers.slice(2, 4);
        const third = fieldPlayers.slice(4);

        if (top.length) rows.push(top);
        if (second.length) rows.push(second);
        if (third.length) rows.push(third);
        if (keeper) rows.push([keeper]);

        return rows;
    };

    const getMarker = (name: string, number?: unknown) => {
        // Prefer showing jersey number if available
        if (number !== undefined && number !== null && String(number).trim() !== '') return String(number);
        if (!name) return '';
        const parts = name.split(' ').filter(Boolean);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + (parts[1][0] ?? '')).toUpperCase();
    };

    const Pitch = ({ formation, players, home }: { formation: string; players: Player[]; home: boolean }) => {
        const rows = buildLineupRows(players, formation);
        if (home) {
            rows.reverse();
        }

        // Render rows top -> bottom; goalkeeper is last row (bottom)
        return (
            <div className="relative w-full h-96 md:h-80 lg:h-96 bg-green-600 rounded-md overflow-hidden border border-green-700">
                <div className="relative z-10 h-full flex flex-col justify-center items-center py-4 space-y-6 md:space-y-4">
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="w-11/12 flex justify-center gap-3 items-center">
                            {row.map((p) => (
                                p.name ? (
                                    <div key={p.id} className="flex flex-col items-center w-20">
                                        <div className="w-10 h-10 rounded-full bg-rose-600 border-2 border-white text-white flex items-center justify-center text-sm font-semibold">{getMarker(p.name, p.number)}</div>
                                        <div className="text-[11px] md:text-xs text-white mt-2 text-center truncate max-w-[72px]">{p.name}</div>
                                    </div>
                                ) : (
                                    <div key={p.id} className="w-20" />
                                )
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) return <div className="container mx-auto p-4">Loading...</div>;
    if (!match) return <div className="container mx-auto p-4">Match not found</div>;

    const homeTeamRec = match.homeTeam as unknown as Record<string, unknown>;
    const awayTeamRec = match.awayTeam as unknown as Record<string, unknown>;
    const homeLogo = (homeTeamRec['logo_url'] as string) || (homeTeamRec['logoUrl'] as string) || PlaceholderPlayerImg;
    const awayLogo = (awayTeamRec['logo_url'] as string) || (awayTeamRec['logoUrl'] as string) || PlaceholderPlayerImg;

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div>
                <Link to="/matches" className="text-sm text-primary underline">← Back to matches</Link>
            </div>

            {/* Header / Hero */}
            <div className="match-card p-6">
                <div className="flex items-start justify-between">
                    <div className="text-sm text-muted-foreground">La Liga • {new Date(match.match_date).toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">{match.status}</div>
                </div>

                <div className="mt-4">
                    <div className="grid grid-cols-3 items-center text-center">
                        <div className="flex flex-col items-center gap-2">
                            {/* <img src={homeLogo} alt={match.homeTeam.name} className="w-16 h-16 object-contain mx-auto" /> */}
                            <div
                                className="w-9 h-9 max-[480px]:w-8 max-[480px]:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                                style={{ backgroundColor: match.homeTeam.colors.primary }}
                            >
                                {match.homeTeam.short_name}
                            </div>
                            <div className="font-semibold text-foreground truncate max-w-[120px]">{match.homeTeam.name}</div>
                        </div>

                        <div className='flex justify-center'>
                            <div className="text-4xl md:text-5xl font-bold text-foreground">{match.home_score ?? 0}</div>
                            <div className="text-3xl md:text-4xl font-bold text-foreground">-</div>
                            <div className="text-4xl md:text-5xl font-bold text-foreground">{match.away_score ?? 0}</div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            {/* <img src={awayLogo} alt={match.awayTeam.name} className="w-16 h-16 object-contain mx-auto" /> */}
                            <div
                                className="w-9 h-9 max-[480px]:w-8 max-[480px]:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                                style={{ backgroundColor: match.awayTeam.colors.primary }}
                            >
                                {match.awayTeam.short_name}
                            </div>
                            <div className="font-semibold text-foreground truncate max-w-[120px]">{match.awayTeam.name}</div>
                        </div>
                    </div>

                    {/* Scorers row */}
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                        <div>
                            {scorers?.filter((s) => s.player)?.slice(0, 3).map((s, i: number) => (
                                <div key={i} className="">
                                    <span className="font-medium text-foreground">{s.player?.player_profile?.name ?? ''}</span>{' '}
                                    <span className="text-muted-foreground">{s.minute}'</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-center">⚽</div>
                        <div className="text-right">
                            {scorers?.filter((s) => s.player)?.slice(3, 6).map((s, i: number) => (
                                <div key={i} className="">
                                    <span className="text-muted-foreground">{s.minute}'</span>{' '}
                                    <span className="font-medium text-foreground">{s.player?.player_profile?.name ?? ''}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="match-card p-0 overflow-hidden min-h-[400px]">
                <div className="flex border-b border-border">
                    <button className={`flex-1 py-3 text-center ${activeTab === 'timeline' ? 'text-foreground font-semibold border-b-2 border-foreground' : 'text-muted-foreground'}`} onClick={() => setActiveTab('timeline')}>TIMELINE</button>
                    <button className={`flex-1 py-3 text-center ${activeTab === 'lineups' ? 'text-foreground font-semibold border-b-2 border-foreground' : 'text-muted-foreground'}`} onClick={() => setActiveTab('lineups')}>LINEUPS</button>
                    <button className={`flex-1 py-3 text-center ${activeTab === 'stats' ? 'text-foreground font-semibold border-b-2 border-foreground' : 'text-muted-foreground'}`} onClick={() => setActiveTab('stats')}>STATS</button>
                </div>

                <div className="p-4">
                    {activeTab === 'timeline' && (
                        <div className="space-y-4 max-w-xl mx-auto py-2">
                            {processedEvents.length === 0 ? (
                                <div className="text-sm text-muted-foreground text-center py-8">No events recorded for this match.</div>
                            ) : (
                                <div className="space-y-4">
                                    {processedEvents.map((e) => {
                                        const playerDetails = findPlayerDetails(e.player?.id);
                                        const eventTeam = e.team_id === match.homeTeam.id ? match.homeTeam : match.awayTeam;
                                        
                                        // Check if it's a Goal/Penalty Goal/Own Goal
                                        const isGoalEvent = e.event === 'Goal' || e.event === 'Penalty Goal' || e.event === 'Own Goal';
                                        
                                        // Header styling based on event type
                                        let headerBg = '';
                                        let headerText = '';
                                        const avatarBorderColor = eventTeam.colors.primary;

                                        if (e.event === 'Goal') {
                                            headerBg = 'bg-gradient-to-r from-rose-600 to-rose-500 text-white';
                                            headerText = 'GOOOAAALLL!!!';
                                        } else if (e.event === 'Penalty Goal') {
                                            headerBg = 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white';
                                            headerText = 'PENALTY GOAL!!!';
                                        } else if (e.event === 'Own Goal') {
                                            headerBg = 'bg-gradient-to-r from-red-700 to-red-600 text-white';
                                            headerText = 'OWN GOAL!!!';
                                        } else if (e.event === 'Yellow Card') {
                                            headerBg = 'bg-amber-500/10 text-amber-500 border-b border-amber-500/20';
                                            headerText = 'YELLOW CARD';
                                        } else if (e.event === 'Red Card') {
                                            headerBg = 'bg-red-500/10 text-red-500 border-b border-red-500/20';
                                            headerText = 'RED CARD';
                                        } else if (e.event === 'Penalty Miss') {
                                            headerBg = 'bg-muted text-muted-foreground border-b border-border';
                                            headerText = 'PENALTY MISS';
                                        }

                                        const showAssist = e.assist_player?.name && (e.event === 'Goal' || e.event === 'Penalty Goal');
                                        const playerPhoto = (playerDetails?.profile_photo_url as string) || PlaceholderPlayerImg;

                                        return (
                                            <div key={e.id} className="match-card p-0 overflow-hidden shadow-md animate-fade-in border border-border/60 rounded-lg">
                                                {/* Header */}
                                                {isGoalEvent ? (
                                                    <div 
                                                        className="p-4 flex flex-col items-center justify-center relative text-white"
                                                        style={{ 
                                                            background: `linear-gradient(135deg, ${eventTeam.colors.primary}, ${eventTeam.colors.secondary || eventTeam.colors.primary})` 
                                                        }}
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs shadow-sm mb-1 text-black">
                                                            ⚽
                                                        </div>
                                                        <div className="font-bold text-base tracking-wider text-center">{headerText}</div>
                                                        <div className="text-xs font-semibold opacity-90">{e.minute}'</div>
                                                    </div>
                                                ) : (
                                                    <div className={`${headerBg} p-3 px-4 flex items-center justify-between text-xs font-semibold`}>
                                                        <div className="flex items-center gap-1.5">
                                                            {e.event === 'Yellow Card' && (
                                                                <span className="w-2.5 h-3.5 bg-yellow-500 rounded-[2px] border border-yellow-600/30 shadow-sm" />
                                                            )}
                                                            {e.event === 'Red Card' && (
                                                                <span className="w-2.5 h-3.5 bg-red-500 rounded-[2px] border border-red-600/30 shadow-sm" />
                                                            )}
                                                            <span>{headerText}</span>
                                                        </div>
                                                        <div>{e.minute}'</div>
                                                    </div>
                                                )}

                                                {/* Sub-header with running score for goals */}
                                                {isGoalEvent && (
                                                    <div 
                                                        className="border-b border-border/20 py-2 px-4 text-center text-xs font-semibold text-foreground/90"
                                                        style={{ 
                                                            backgroundColor: eventTeam.colors.primary.startsWith('#') 
                                                                ? `${eventTeam.colors.primary}15` 
                                                                : 'rgba(0, 0, 0, 0.15)' 
                                                        }}
                                                    >
                                                        <span className="opacity-90">{e.shortScoreStr}</span>
                                                    </div>
                                                )}

                                                {/* Card Body */}
                                                <div className="p-4 space-y-3">
                                                    <div className="flex items-center justify-between gap-4">
                                                        {/* Left side details */}
                                                        <div className="space-y-1 min-w-0 flex-1">
                                                            <div className="font-bold text-base text-foreground truncate">{e.player?.name || 'Unknown Player'}</div>
                                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                                                                <span
                                                                    className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold text-[8px] shrink-0"
                                                                    style={{ backgroundColor: eventTeam.colors.primary }}
                                                                >
                                                                    {eventTeam.short_name}
                                                                </span>
                                                                <span className="truncate">{eventTeam.name}</span>
                                                                <span>·</span>
                                                                <span className="truncate">
                                                                    {(playerDetails?.position as string) || 'Player'}{' '}
                                                                    {playerDetails?.jersey_number ? `#${playerDetails.jersey_number}` : ''}
                                                                </span>
                                                            </div>
                                                            {showAssist && (
                                                                <div className="text-xs text-muted-foreground mt-1">
                                                                    <span className="font-semibold text-foreground">Asst:</span> {e.assist_player?.name}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Right side player photo */}
                                                        <div 
                                                            className="relative w-12 h-12 rounded-full overflow-hidden border-2 shadow-sm bg-muted shrink-0"
                                                            style={{ borderColor: avatarBorderColor }}
                                                        >
                                                            <img
                                                                src={playerPhoto}
                                                                alt={e.player?.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(ev) => {
                                                                    ev.currentTarget.src = PlaceholderPlayerImg;
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Commentary description */}
                                                    {e.description && (
                                                        <div className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed pt-2.5 border-t border-border/20">
                                                            {e.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'lineups' && (
                        <div>
                            <div className="bg-gradient-to-b from-green-600 to-green-500 rounded-b-lg overflow-hidden p-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="font-semibold">{match.homeTeam.name}</div>
                                    {/* <div className="font-semibold">{inferFormation(homePlayers.length)}</div> */}
                                </div>
                                <div className="mt-4">
                                    <Pitch formation={inferFormation(homePlayers.length)} players={homePlayers} home={true} />
                                </div>
                            </div>

                            <div className="mt-4 bg-gradient-to-b from-green-600 to-green-500 rounded-b-lg overflow-hidden p-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="font-semibold">{match.awayTeam.name}</div>
                                    {/* <div className="font-semibold">{inferFormation(awayPlayers.length)}</div> */}
                                </div>
                                <div className="mt-4">
                                    <Pitch formation={inferFormation(awayPlayers.length)} players={awayPlayers} home={false} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{match.home_score ?? 0}</div>
                                    <div className="text-xs text-muted-foreground">Goals (Home)</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{(match.home_score ?? 0) + (match.away_score ?? 0)}</div>
                                    <div className="text-xs text-muted-foreground">Total Goals</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{match.away_score ?? 0}</div>
                                    <div className="text-xs text-muted-foreground">Goals (Away)</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchDetails;

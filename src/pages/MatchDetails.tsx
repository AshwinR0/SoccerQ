import { useMemo, useState } from 'react';
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
        is_penalty?: boolean;
        player?: { id: string; name?: string } | null;
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
            return {
                id: Number(rec['id'] as number),
                match_id: String(rec['match_id'] as string | number),
                event: String(rec['event'] as string ?? ''),
                minute: Number(rec['minute'] as number ?? 0),
                is_penalty: rec['is_penalty'] as boolean | undefined,
                player,
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
                        <div>
                            {events.length === 0 ? <div className="text-sm text-muted-foreground">No events</div> : (
                                <div className="space-y-3">
                                    {events.map((e: MatchEvent) => (
                                        <div key={e.id} className="flex items-start space-x-3">
                                            <div className="w-12 text-sm text-muted-foreground">{e.minute}'</div>
                                            <div className="flex-1">
                                                <div className="font-medium">{e.event}</div>
                                                <div className="text-sm text-muted-foreground">{e.player?.name}</div>
                                            </div>
                                        </div>
                                    ))}
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

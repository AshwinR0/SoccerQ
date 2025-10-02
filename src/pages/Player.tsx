import { Link, useParams } from 'react-router-dom';
import { usePlayers, useTeams } from '@/hooks/useSeasonHooks';
import PlaceholderPlayerImg from '@/assets/placeholder_player.png';
import { User } from 'lucide-react';

const Player = () => {
  const params = useParams();
  const playerId = params.player_id || params.playerId;

  const { data: players, isLoading } = usePlayers();
  const { data: teams } = useTeams();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="match-card text-center py-12">Loading player...</div>
      </div>
    );
  }

  const player = players?.find(p => p.player_id === playerId);

  if (!player) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="match-card text-center py-12">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Player not found</h3>
          <p className="text-muted-foreground">We couldn't find a player with the id in the URL.</p>
          <div className="mt-4">
            <Link to="/players" className="text-sm text-primary underline">Back to players</Link>
          </div>
        </div>
      </div>
    );
  }

  const team = teams?.find(t => t.id === player.team_id);

  // Simple career history mock if not available from API
  interface CareerEntry {
    season: string;
    club: string;
    appearances: number;
    assists: number;
    goals: number;
    minutes?: number;
  }

  let careerHistory: CareerEntry[];
  if (player && 'career_history' in (player as unknown as Record<string, unknown>) && Array.isArray((player as unknown as Record<string, unknown>)['career_history'])) {
    careerHistory = (player as unknown as { career_history?: CareerEntry[] }).career_history || [];
  } else {
    careerHistory = [
      { season: '2025/2026', club: team?.name || 'Unknown', appearances: player.appearances, assists: player.assists, goals: player.goals },
      { season: '2024/2025', club: team?.name || 'Unknown', appearances: Math.max(0, player.appearances - 10), assists: Math.max(0, player.assists - 1), goals: Math.max(0, player.goals - 3) }
    ];
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 overflow-x-hidden box-border max-w-full">
      {/* Hero: player image and name */}

      <div className="mb-4">
        <Link to="/players" className="text-sm text-muted-foreground underline">← Back to players</Link>
      </div>

      <div className="relative rounded-lg overflow-hidden">
        <div className="w-full match-card p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 shadow-md overflow-hidden">
          <div className="w-36 md:w-40 lg:w-48 flex-shrink-0 flex-shrink">
            <img
              src={player.profile_photo_url || PlaceholderPlayerImg}
              alt={player.name}
              className="w-full h-auto object-contain rounded-lg"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = PlaceholderPlayerImg; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg opacity-80 truncate text-muted-foreground">{team?.short_name} • {player.jersey_number} {player.position}</div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mt-2 break-words text-foreground">{player.name}</h1>
            <p className="mt-2 text-sm opacity-90 text-muted-foreground">{player.nationality}</p>
          </div>
        </div>
      </div>

      {/* Stats box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
        <div className="match-card p-4 col-span-1 md:col-span-2 w-full">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{player.appearances}</div>
              <div className="text-xs text-muted-foreground">Appearances</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{player.goals}</div>
              <div className="text-xs text-muted-foreground">Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{player.assists}</div>
              <div className="text-xs text-muted-foreground">Assists</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Minutes</div>
              <div className="text-foreground font-medium">{player.minutesPlayed}'</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Nationality</div>
              <div className="text-foreground font-medium">{player.nationality}</div>
            </div>
          </div>
        </div>

  <div className="match-card p-4 w-full">
          <h3 className="text-sm text-muted-foreground">Player Info</h3>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Position</span>
              <span className="text-foreground font-medium">{player.position}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Jersey</span>
              <span className="text-foreground font-medium">{player.jersey_number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Team</span>
              <span className="text-foreground font-medium">{team?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Career history */}
  <div className="space-y-3 w-full">
        <h2 className="text-xl font-semibold">Career History</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {careerHistory.map((ch: CareerEntry, idx: number) => (
            <div key={idx} className="match-card p-4 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">{ch.season}</div>
                  <div className="text-sm text-muted-foreground mt-1">{ch.club}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Apps</div>
                  <div className="font-bold">{ch.appearances}</div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Goals</div>
                  <div className="font-bold">{ch.goals}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Assists</div>
                  <div className="font-bold">{ch.assists}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Minutes</div>
                  <div className="font-bold">{ch.minutes || player.minutesPlayed}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Player;

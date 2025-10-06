import { Link, useParams } from "react-router-dom";
import { useCareerHistory, usePlayers, usePlayerSummary, useTeams } from "@/hooks/useSeasonHooks";
import type { CareerHistory, PlayerSummary } from '@/types';
import PlaceholderPlayerImg from "@/assets/placeholder_player.png";
import { User } from "lucide-react";

const Player = () => {
  const params = useParams();
  const playerId = params.player_id || params.playerId;
  const { data: playerSummary } = usePlayerSummary(playerId);
  const { data: careerHistory } = useCareerHistory(playerId);
  const player = careerHistory?.[0]

  const summary = playerSummary?.[0] ?? null;


  if (!player) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="match-card text-center py-12">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Player not found
          </h3>
          <p className="text-muted-foreground">
            We couldn't find a player with the id in the URL.
          </p>
          <div className="mt-4">
            <Link to="/players" className="text-sm text-primary underline">
              Back to players
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // const team = teams?.find((t) => t.id === player.team_id);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 overflow-x-hidden box-border max-w-full">
      {/* Hero: player image and name */}

      <div className="mb-4">
        <Link to="/players" className="text-sm text-muted-foreground underline">
          ← Back to players
        </Link>
      </div>

      <div className="relative rounded-lg overflow-hidden">
        <div className="w-full match-card p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 shadow-md overflow-hidden">
          <div className="w-36 md:w-40 lg:w-48 flex-shrink-0 flex-shrink">
            <img
              src={player?.profile_photo_url || PlaceholderPlayerImg}
              alt={player?.name}
              className="w-full h-auto object-contain rounded-lg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  PlaceholderPlayerImg;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg opacity-80 truncate text-muted-foreground">
              {/* {team?.short_name} • {player.jersey_number} {player.position} */}
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mt-2 break-words text-foreground">
              {player?.name}
            </h1>
            <p className="mt-2 text-sm opacity-90 text-muted-foreground">
              {player?.locality}
            </p>
          </div>
        </div>
      </div>

      {/* Stats box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
        <div className="match-card p-4 col-span-1 md:col-span-1 w-full">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {summary?.total_appearances}
              </div>
              <div className="text-xs text-muted-foreground">Appearances</div>
            </div>
            {player?.position === 'Goalkeeper' ? (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {summary?.total_cleam_sheets ?? ((summary as unknown as Record<string, unknown>)['total_clean_sheets'] as number) ?? 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Clean Sheets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {summary?.total_saves ?? 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Saves</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {summary?.total_goals}
                  </div>
                  <div className="text-xs text-muted-foreground">Goals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {summary?.total_assists}
                  </div>
                  <div className="text-xs text-muted-foreground">Assists</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="match-card p-4 col-span-1 md:col-span-2 w-full">
          <h3 className="text-lg font-semibold mb-4">Player Info</h3>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Position</span>
              <span className="text-foreground font-medium">
                {player?.position}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Jersey</span>
              <span className="text-foreground font-medium">
                {player?.jersey_number}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Team</span>
              <span className="text-foreground font-medium">{player?.team_name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Career history */}
      <div className="space-y-3 w-full">
        <h2 className="text-xl font-semibold">Career History</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {careerHistory?.map((ch: CareerHistory, idx: number) => (
            <div key={idx} className="match-card p-4 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">{ch.season_name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {ch.team_name}
                  </div>
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
                  <div className="text-sm text-muted-foreground">Clean Sheets</div>
                  <div className="font-bold">
                    {ch.clean_sheets}
                  </div>
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

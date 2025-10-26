import { useSeasonContext } from '@/contexts/SeasonContext';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useCallback } from 'react';
import {
  getTeamsBySeason,
  getPlayersBySeason,
  getMatchesBySeason,
  getStandingsBySeason,
  getTopScorersBySeason,
  getTopAssistersBySeason,
  getGoldenGloveBySeason,
  getPlayerSummary,
  getCareerHistory,
  getMatchById,
  getMatchEvents,
  getMatchScorers,
  getPlayersByTeam,
} from '@/services/api';

// Hook to fetch players by team id
export const useTeamPlayers = (teamId: string | undefined) => {
  const queryFn = useCallback(async (_key: string) => (teamId ? getPlayersByTeam(teamId) : Promise.resolve([])), [teamId]);
  return useSupabaseQuery({
    queryKey: teamId ? `${teamId}-players` : undefined,
    queryFn,
  });
};

// A helper to get the current season ID
const useCurrentSeasonId = () => {
  const { currentSeason } = useSeasonContext();
  return currentSeason?.id;
};

// Hook to fetch only teams
export const useTeams = () => {
  const seasonId = useCurrentSeasonId();
  return useSupabaseQuery({
    queryKey: seasonId,
    queryFn: getTeamsBySeason,
  });
};

// Hook to fetch only players
export const usePlayers = () => {
  const seasonId = useCurrentSeasonId();
  return useSupabaseQuery({
    queryKey: seasonId,
    queryFn: getPlayersBySeason,
  });
};

// Hook to fetch only matches
export const useMatches = () => {
  const seasonId = useCurrentSeasonId();
  return useSupabaseQuery({
    queryKey: seasonId,
    queryFn: getMatchesBySeason,
  });
};

// Hook to fetch only standings
export const useStandings = () => {
  const seasonId = useCurrentSeasonId();
  return useSupabaseQuery({
    queryKey: seasonId,
    queryFn: getStandingsBySeason,
  });
};

// Hook to fetch only top scorers
export const useTopScorers = () => {
  const seasonId = useCurrentSeasonId();
  return useSupabaseQuery({
    queryKey: seasonId,
    queryFn: getTopScorersBySeason,
  });
};

// Hook to fetch only top scorers
export const useTopAssisters = () => {
  const seasonId = useCurrentSeasonId();
  return useSupabaseQuery({
    queryKey: seasonId,
    queryFn: getTopAssistersBySeason,
  });
};

// Hook to fetch only golden glove contenders
export const useGoldenGlove = () => {
  const seasonId = useCurrentSeasonId();
  return useSupabaseQuery({
    queryKey: seasonId,
    queryFn: getGoldenGloveBySeason,
  });
};

// Hook to fetch only players
export const usePlayerSummary = (player_id: string) => {
  // const seasoplanId = useCurrentSeasonId();
  return useSupabaseQuery({
    queryKey: player_id,
    queryFn: getPlayerSummary,
  });
};

// Hook to fetch only players
export const useCareerHistory = (player_id: string) => {
  // const seasoplanId = useCurrentSeasonId();
  return useSupabaseQuery({
    queryKey: player_id,
    queryFn: getCareerHistory,
  });
};

// Hook to fetch a single match by id
export const useMatch = (matchId: string | undefined) => {
  const queryFn = useCallback(async (_key: string) => (matchId ? getMatchById(matchId) : Promise.resolve(null)), [matchId]);
  return useSupabaseQuery({
    queryKey: matchId ?? undefined,
    queryFn,
  });
};

// Hook to fetch match events
export const useMatchEvents = (matchId: string | undefined) => {
  const queryFn = useCallback(async (_key: string) => (matchId ? getMatchEvents(matchId) : Promise.resolve([])), [matchId]);
  return useSupabaseQuery({
    queryKey: matchId ? `${matchId}-events` : undefined,
    queryFn,
  });
};

// Hook to fetch match scorers
export const useMatchScorers = (matchId: string | undefined) => {
  const queryFn = useCallback(async (_key: string) => (matchId ? getMatchScorers(matchId) : Promise.resolve([])), [matchId]);
  return useSupabaseQuery({
    queryKey: matchId ? `${matchId}-scorers` : undefined,
    queryFn,
  });
};
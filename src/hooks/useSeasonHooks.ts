import { useSeasonContext } from '@/contexts/SeasonContext';
import { useSupabaseQuery } from './useSupabaseQuery';
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
} from '@/services/api';

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
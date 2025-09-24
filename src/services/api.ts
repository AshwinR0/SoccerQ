import { supabase } from '@/lib/supabaseClient';
import { Team, Player, Match, Standing, TopScorer, GoldenGlove, Season } from '../types';
// Fetch Seasons
export const getSeasons = () =>
  fetchData<Season[]>(supabase.from('seasons').select('*'));

// Helper for type safety
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchData<T>(query: any): Promise<T> {
  const { data, error } = await query;
  if (error) throw error;
  return data as T;
}

// Fetch Teams
export const getTeamsBySeason = (seasonId: string) =>
  fetchData<Team[]>(supabase.from('teams').select('*').eq('season_id', seasonId));

// Fetch Players
export const getPlayersBySeason = (seasonId: string) =>
  fetchData<Player[]>(supabase.from('players').select('*').eq('season_id', seasonId));

// Fetch Matches
export const getMatchesBySeason = (seasonId: string) =>
  fetchData<Match[]>(
    supabase
      .from('matches')
      .select('*, homeTeam:teams!home_team_id(*), awayTeam:teams!away_team_id(*)')
      .eq('season_id', seasonId)
  );

// Fetch Standings
export const getStandingsBySeason = (seasonId: string) =>
  fetchData<Standing[]>(
    supabase
      .from('standings')
      .select('*, team:teams!team_id(*)')
      .eq('season_id', seasonId)
      .order('position', { ascending: true })
  );

// Fetch Top Scorers
export const getTopScorersBySeason = (seasonId: string) =>
  fetchData<TopScorer[]>(
    supabase
      .from('top_scorers')
      .select('*, player:players!player_id(*, team:teams!team_id(*))')
      .eq('season_id', seasonId)
      .order('rank', { ascending: true })
  );

// Fetch Golden Glove
export const getGoldenGloveBySeason = (seasonId: string) =>
  fetchData<GoldenGlove[]>(
    supabase
      .from('golden_gloves')
      .select('*, player:players!player_id(*, team:teams!team_id(*))')
      .eq('season_id', seasonId)
      .order('rank', { ascending: true })
  );
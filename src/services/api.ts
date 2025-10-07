import { supabase } from '@/lib/supabaseClient';
import { Team, Player, Match, Standing, TopScorer, GoldenGlove, Season, PlayerSummary, CareerHistory } from '../types';
// Fetch Seasons
export const getSeasons = () =>
  fetchData<Season[]>(supabase.from('seasons').select('*').order('start_date', { ascending: true }));

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

// Fetch Player Summary
export const getPlayerSummary = (player_id: string) =>
  fetchData<PlayerSummary[]>(supabase.from('player_summary').select('*').eq('player_id', player_id));

// Fetch Player Summary
export const getCareerHistory = (player_id: string) =>
  fetchData<CareerHistory[]>(
    supabase
      .from('player_details')
      .select('name, season_name, team_name, position, jersey_number, locality, profile_photo_url, goals, assists, saves, clean_sheets, saves, appearances')
      .eq('player_id', player_id)
      .order('season_id', { ascending: false }));

// Fetch Players
export const getPlayersBySeason = (seasonId: string) =>
  fetchData<Player[]>(supabase.from('player_details').select('*').eq('season_id', seasonId));

// Fetch Matches
export const getMatchesBySeason = (seasonId: string) =>
  fetchData<Match[]>(
    supabase
      .from('matches')
      .select('*, homeTeam:teams!home_team_id(*), awayTeam:teams!away_team_id(*)')
      .eq('season_id', seasonId)
      .order('id', { ascending: true })
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
      .select('*, player:player_details!player_id(*, team:teams!team_id(*))')
      .eq('season_id', seasonId).gt('goals', 0)
      .order('rank', { ascending: true })
  );

// Fetch Top Scorers
export const getTopAssistersBySeason = (seasonId: string) =>
  fetchData<TopScorer[]>(
    supabase
      .from('top_scorers')
      .select('*, player:player_details!player_id(*, team:teams!team_id(*))')
      .eq('season_id', seasonId).gt('assists', 0)
      .order('assists', { ascending: false })
  );

// Fetch Golden Glove
export const getGoldenGloveBySeason = (seasonId: string) =>
  fetchData<GoldenGlove[]>(
    supabase
      .from('golden_gloves')
      .select('*, player:player_details!player_id(*, team:teams!team_id(*))')
      .eq('season_id', seasonId).gt('saves', 0)
      .order('rank', { ascending: true })
  );
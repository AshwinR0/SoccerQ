export interface Season {
  id: string;
  name: string;
  year: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Match {
  id: string;
  season_id: string;
  match_date: string;
  match_time: string;
  timezone: string;
  venue: string;
  homeTeam: Team;
  awayTeam: Team;
  home_score?: number;
  away_score?: number;
  status: 'Upcoming' | 'Completed' | 'Live' | 'Postponed' | 'Cancelled';
  stage: string;
  group?: string;
  scorers?: Scorer[];
  yellow_cards?: string[];
  red_cards?: string[];
  attendance?: number;
  notes?: string;
}

export interface Team {
  id: string;
  season_id: string;
  name: string;
  short_name: string;
  coach: string;
  group?: string;
  founded: number;
  stadium: string;
  logoUrl: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  teamBio: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export interface Player {
  id: string;
  season_id: string;
  name: string;
  team_id: string;
  player_id: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  jersey_number: number;
  dateOfBirth: string;
  locality: string;
  goals: number;
  assists: number;
  saves?: number;
  clean_sheets?: number;
  appearances: number;
  minutesPlayed: number;
  profile_photo_url: string;
  bio: string;
  yellow_cards: number;
  red_cards: number;
}

export interface PlayerSummary {
  date_of_birth: string;  
  locality: string;
  name: string;
  position: string;
  player_id: string;
  total_appearances: number;
  total_goals: number;
  total_assists: number;
  total_cleam_sheets: number;
  total_minutes_played: number;
  total_saves: number;
}

export interface CareerHistory {
  name: string;
  season_name: string;
  team_name: string;
  position: string;
  jersey_number: number;
  locality: string;
  profile_photo_url: string;
  appearances: number;
  goals: number;
  assists: number;
  clean_sheets: number;
  saves: number;
}

export interface Scorer {
  playerId: string;
  playerName: string;
  minute: number;
  type: 'goal' | 'own_goal' | 'penalty';
}

export interface Standing {
  position: number;
  team: Team;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

export interface TopScorer {
  rank: number;
  player: Player;
  team: Team;
  goals: number;
  assists: number;
}

export interface GoldenGlove {
  rank: number;
  player: Player;
  team: Team;
  saves: number;
  clean_sheets: number;
}
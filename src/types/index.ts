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
  nationality: string;
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
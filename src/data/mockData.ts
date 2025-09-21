import { Season, Team, Player, Match, Standing, TopScorer, GoldenGlove } from '../types';

// Mock Seasons Data
export const mockSeasons: Season[] = [
  {
    id: 'S001',
    name: 'Championship 2025',
    year: '2025',
    startDate: '2025-03-01',
    endDate: '2025-09-30',
    isActive: true
  },
  {
    id: 'S002',
    name: 'Championship 2024',
    year: '2024',
    startDate: '2024-03-01',
    endDate: '2024-09-30',
    isActive: false
  },
  {
    id: 'S003',
    name: 'Cup Tournament 2025',
    year: '2025',
    startDate: '2025-01-15',
    endDate: '2025-05-15',
    isActive: false
  }
];

// Mock Teams Data
export const mockTeams: Team[] = [
  {
    id: 'T001',
    season_id: 'S001',
    name: 'Manchester Rovers',
    short_name: 'MAN',
    coach: 'Alex Ferguson Jr.',
    group: 'A',
    founded: 1998,
    stadium: 'Old Trafford Stadium',
    logoUrl: '/api/placeholder/100/100',
    played: 3,
    wins: 3,
    draws: 0,
    losses: 0,
    goals_for: 8,
    goals_against: 2,
    goal_difference: 6,
    points: 9,
    teamBio: 'Defending champions with a strong attacking lineup.',
    colors: { primary: '#DC143C', secondary: '#FFD700' }
  },
  {
    id: 'T002',
    season_id: 'S001',
    name: 'Barcelona United',
    short_name: 'BAR',
    coach: 'Pep Guardiola',
    group: 'A',
    founded: 2001,
    stadium: 'Camp Nou Arena',
    logoUrl: '/api/placeholder/100/100',
    played: 3,
    wins: 2,
    draws: 1,
    losses: 0,
    goals_for: 6,
    goals_against: 3,
    goal_difference: 3,
    points: 7,
    teamBio: 'Technical team known for possession-based football.',
    colors: { primary: '#004D98', secondary: '#A50044' }
  },
  {
    id: 'T003',
    season_id: 'S001',
    name: 'Arsenal Eagles',
    short_name: 'ARS',
    coach: 'Mikel Arteta',
    group: 'B',
    founded: 1999,
    stadium: 'Emirates Stadium',
    logoUrl: '/api/placeholder/100/100',
    played: 3,
    wins: 2,
    draws: 0,
    losses: 1,
    goals_for: 5,
    goals_against: 4,
    goal_difference: 1,
    points: 6,
    teamBio: 'Young squad with promising attacking talent.',
    colors: { primary: '#EF0107', secondary: '#023474' }
  },
  {
    id: 'T004',
    season_id: 'S001',
    name: 'Liverpool Lions',
    short_name: 'LIV',
    coach: 'Jurgen Klopp',
    group: 'B',
    founded: 2000,
    stadium: 'Anfield Stadium',
    logoUrl: '/api/placeholder/100/100',
    played: 3,
    wins: 1,
    draws: 1,
    losses: 1,
    goals_for: 4,
    goals_against: 5,
    goal_difference: -1,
    points: 4,
    teamBio: 'Fast-paced attacking team with solid defense.',
    colors: { primary: '#C8102E', secondary: '#F6EB61' }
  },
  // Previous season teams
  {
    id: 'T005',
    season_id: 'S002',
    name: 'Chelsea Blues',
    short_name: 'CHE',
    coach: 'Frank Lampard',
    group: 'A',
    founded: 1997,
    stadium: 'Stamford Bridge',
    logoUrl: '/api/placeholder/100/100',
    played: 3,
    wins: 2,
    draws: 1,
    losses: 0,
    goals_for: 7,
    goals_against: 3,
    goal_difference: 4,
    points: 7,
    teamBio: 'Strong defensive team with clinical finishing.',
    colors: { primary: '#034694', secondary: '#FFFFFF' }
  },
  {
    id: 'T006',
    season_id: 'S002',
    name: 'Tottenham Spurs',
    short_name: 'TOT',
    coach: 'Antonio Conte',
    group: 'A',
    founded: 2000,
    stadium: 'Tottenham Stadium',
    logoUrl: '/api/placeholder/100/100',
    played: 3,
    wins: 1,
    draws: 2,
    losses: 0,
    goals_for: 5,
    goals_against: 4,
    goal_difference: 1,
    points: 5,
    teamBio: 'Balanced team with good midfield control.',
    colors: { primary: '#132257', secondary: '#FFFFFF' }
  }
];

// Mock Players Data
export const mockPlayers: Player[] = [
  {
    id: 'P001',
    season_id: 'S001',
    name: 'Abishek Biju',
    team_id: 'T001',
    position: 'Forward',
    jersey_number: 10,
    dateOfBirth: '1997-10-31',
    nationality: 'England',
    goals: 5,
    assists: 2,
    appearances: 3,
    minutesPlayed: 270,
    profile_photo_url: '/src/assets/player-1.jpg',
    bio: 'Clinical striker with pace and finishing ability.',
    yellow_cards: 1,
    red_cards: 0
  },
  {
    id: 'P002',
    season_id: 'S001',
    name: 'Ajay NA',
    team_id: 'T002',
    position: 'Midfielder',
    jersey_number: 16,
    dateOfBirth: '2002-11-25',
    nationality: 'Spain',
    goals: 2,
    assists: 4,
    appearances: 3,
    minutesPlayed: 270,
    profile_photo_url: '/src/assets/player-2.jpg',
    bio: 'Creative midfielder with excellent passing range.',
    yellow_cards: 0,
    red_cards: 0
  },
  {
    id: 'P003',
    season_id: 'S001',
    name: 'Alan Aldrin',
    team_id: 'T003',
    position: 'Forward',
    jersey_number: 7,
    dateOfBirth: '2001-09-05',
    nationality: 'England',
    goals: 3,
    assists: 1,
    appearances: 3,
    minutesPlayed: 245,
    profile_photo_url: '/src/assets/player-3.jpg',
    bio: 'Versatile winger with pace and crossing ability.',
    yellow_cards: 2,
    red_cards: 0
  },
  {
    id: 'P004',
    season_id: 'S001',
    name: 'Alan Jose',
    team_id: 'T004',
    position: 'Goalkeeper',
    jersey_number: 1,
    dateOfBirth: '1993-10-02',
    nationality: 'Brazil',
    goals: 0,
    assists: 0,
    saves: 15,
    clean_sheets: 1,
    appearances: 3,
    minutesPlayed: 270,
    profile_photo_url: '/src/assets/player-4.jpg',
    bio: 'World-class goalkeeper with excellent distribution.',
    yellow_cards: 0,
    red_cards: 0
  },
  {
    id: 'P005',
    season_id: 'S001',
    name: 'Alan Shaji',
    team_id: 'T001',
    position: 'Forward',
    jersey_number: 10,
    dateOfBirth: '1997-10-31',
    nationality: 'England',
    goals: 5,
    assists: 2,
    appearances: 3,
    minutesPlayed: 270,
    profile_photo_url: '/src/assets/player-5.jpg',
    bio: 'Clinical striker with pace and finishing ability.',
    yellow_cards: 1,
    red_cards: 0
  },
  {
    id: 'P006',
    season_id: 'S001',
    name: 'Albin Saj',
    team_id: 'T001',
    position: 'Forward',
    jersey_number: 10,
    dateOfBirth: '1997-10-31',
    nationality: 'England',
    goals: 5,
    assists: 2,
    appearances: 3,
    minutesPlayed: 270,
    profile_photo_url: '/src/assets/player-6.jpg',
    bio: 'Clinical striker with pace and finishing ability.',
    yellow_cards: 1,
    red_cards: 0
  },
  {
    id: 'P007',
    season_id: 'S001',
    name: 'Anandu',
    team_id: 'T001',
    position: 'Forward',
    jersey_number: 10,
    dateOfBirth: '1997-10-31',
    nationality: 'England',
    goals: 5,
    assists: 2,
    appearances: 3,
    minutesPlayed: 270,
    profile_photo_url: '/src/assets/player-7.jpg',
    bio: 'Clinical striker with pace and finishing ability.',
    yellow_cards: 1,
    red_cards: 0
  },
  // Previous season players
  {
    id: 'P008',
    season_id: 'S002',
    name: 'Mason Mount',
    team_id: 'T005',
    position: 'Midfielder',
    jersey_number: 19,
    dateOfBirth: '1999-01-10',
    nationality: 'England',
    goals: 4,
    assists: 3,
    appearances: 3,
    minutesPlayed: 260,
    profile_photo_url: '/src/assets/player-8.jpg',
    bio: 'Dynamic midfielder with excellent work rate.',
    yellow_cards: 1,
    red_cards: 0
  },
  {
    id: 'P009',
    season_id: 'S002',
    name: 'Harry Kane',
    team_id: 'T006',
    position: 'Forward',
    jersey_number: 9,
    dateOfBirth: '1993-07-28',
    nationality: 'England',
    goals: 6,
    assists: 1,
    appearances: 3,
    minutesPlayed: 270,
    profile_photo_url: '/src/assets/player-13.jpg',
    bio: 'Prolific striker and team captain.',
    yellow_cards: 0,
    red_cards: 0
  }
];

// Mock Matches Data
export const mockMatches: Match[] = [
  {
    id: 'M001',
    season_id: 'S001',
    match_date: '2025-09-22',
    match_time: '15:00',
    timezone: 'UTC',
    venue: 'Old Trafford Stadium',
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    home_score: 3,
    away_score: 1,
    status: 'Completed',
    stage: 'Group Stage',
    group: 'A',
    scorers: [
      { playerId: 'P001', playerName: 'Marcus Rashford', minute: 23, type: 'goal' },
      { playerId: 'P001', playerName: 'Marcus Rashford', minute: 45, type: 'goal' },
      { playerId: 'P002', playerName: 'Pedri González', minute: 67, type: 'goal' },
      { playerId: 'P001', playerName: 'Marcus Rashford', minute: 89, type: 'goal' }
    ],
    attendance: 74000
  },
  {
    id: 'M002',
    season_id: 'S001',
    match_date: '2025-09-23',
    match_time: '18:00',
    timezone: 'UTC',
    venue: 'Emirates Stadium',
    homeTeam: mockTeams[2],
    awayTeam: mockTeams[3],
    home_score: 2,
    away_score: 2,
    status: 'Completed',
    stage: 'Group Stage',
    group: 'B',
    scorers: [
      { playerId: 'P003', playerName: 'Bukayo Saka', minute: 15, type: 'goal' },
      { playerId: 'P003', playerName: 'Bukayo Saka', minute: 72, type: 'goal' }
    ],
    attendance: 60000
  },
  {
    id: 'M003',
    season_id: 'S001',
    match_date: '2025-09-24',
    match_time: '20:00',
    timezone: 'UTC',
    venue: 'Camp Nou Arena',
    homeTeam: mockTeams[1],
    awayTeam: mockTeams[2],
    status: 'Upcoming',
    stage: 'Group Stage',
    group: 'Cross-Group'
  },
  {
    id: 'M004',
    season_id: 'S001',
    match_date: '2025-09-25',
    match_time: '16:00',
    timezone: 'UTC',
    venue: 'Anfield Stadium',
    homeTeam: mockTeams[3],
    awayTeam: mockTeams[0],
    status: 'Upcoming',
    stage: 'Group Stage',
    group: 'Cross-Group'
  },
  // Previous season matches
  {
    id: 'M005',
    season_id: 'S002',
    match_date: '2024-09-15',
    match_time: '19:00',
    timezone: 'UTC',
    venue: 'Stamford Bridge',
    homeTeam: mockTeams[4],
    awayTeam: mockTeams[5],
    home_score: 2,
    away_score: 1,
    status: 'Completed',
    stage: 'Group Stage',
    group: 'A',
    attendance: 40000
  }
];

// Mock Standings
export const mockStandings: Standing[] = [
  {
    position: 1,
    team: mockTeams[0],
    played: 3,
    wins: 3,
    draws: 0,
    losses: 0,
    goals_for: 8,
    goals_against: 2,
    goal_difference: 6,
    points: 9
  },
  {
    position: 2,
    team: mockTeams[1],
    played: 3,
    wins: 2,
    draws: 1,
    losses: 0,
    goals_for: 6,
    goals_against: 3,
    goal_difference: 3,
    points: 7
  },
  {
    position: 3,
    team: mockTeams[2],
    played: 3,
    wins: 2,
    draws: 0,
    losses: 1,
    goals_for: 5,
    goals_against: 4,
    goal_difference: 1,
    points: 6
  },
  {
    position: 4,
    team: mockTeams[3],
    played: 3,
    wins: 1,
    draws: 1,
    losses: 1,
    goals_for: 4,
    goals_against: 5,
    goal_difference: -1,
    points: 4
  }
];

// Mock Top Scorers
export const mockTopScorers: TopScorer[] = [
  {
    rank: 1,
    player: mockPlayers[0],
    team: mockTeams[0],
    goals: 5,
    assists: 2
  },
  {
    rank: 2,
    player: mockPlayers[2],
    team: mockTeams[2],
    goals: 3,
    assists: 1
  },
  {
    rank: 3,
    player: mockPlayers[1],
    team: mockTeams[1],
    goals: 2,
    assists: 4
  }
];

// Mock Golden Glove
export const mockGoldenGlove: GoldenGlove[] = [
  {
    rank: 1,
    player: mockPlayers[3],
    team: mockTeams[3],
    saves: 15,
    clean_sheets: 1
  }
];
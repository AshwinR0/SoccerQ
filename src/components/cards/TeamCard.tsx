import { Link } from 'react-router-dom';
import { Team } from '@/types';
import { Trophy, Users, MapPin } from 'lucide-react';

interface TeamCardProps {
  team: Team;
}

const TeamCard = ({ team }: TeamCardProps) => {
  const winPercentage = team.played > 0 ? Math.round((team.wins / team.played) * 100) : 0;

  return (
    // <Link to={`/teams/${team.id}`}>
      <div className="team-card cursor-pointer animate-fade-in">
        {/* Team Header with Color Accent */}
        <div 
          className="h-20 p-4 flex items-end"
          style={{
            background: `linear-gradient(135deg, ${team.colors.primary}dd, ${team.colors.secondary}dd)`
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: team.colors.primary }}
            >
              {team.short_name}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{team.name}</h3>
              <p className="text-white/80 text-sm">{team.short_name}</p>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{team.points}</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{team.wins}</div>
              <div className="text-xs text-muted-foreground">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{winPercentage}%</div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
          </div>

          {/* Team Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Coach: {team.coach}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{team.stadium}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>Founded {team.founded}</span>
            </div>
          </div>

          {/* Form Record */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Season Record</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-success">W: {team.wins}</span>
              <span className="text-muted-foreground">D: {team.draws}</span>
              <span className="text-destructive">L: {team.losses}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-foreground">GF: {team.goals_for}</span>
              <span className="text-foreground">GA: {team.goals_against}</span>
              <span className={`${team.goal_difference >= 0 ? 'text-success' : 'text-destructive'}`}>
                GD: {team.goal_difference >= 0 ? '+' : ''}{team.goal_difference}
              </span>
            </div>
          </div>
        </div>
      </div>
    // </Link>
  );
};

export default TeamCard;
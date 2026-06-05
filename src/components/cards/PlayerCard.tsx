import { Link } from 'react-router-dom';
import { Player } from '@/types';
import { Target, Users, Shield, Award } from 'lucide-react';
import PlaceholderPlayerImg from "../../assets/placeholder_player.png"

interface PlayerCardProps {
  player: Player;
  team?: { id: string; name: string; short_name: string; colors: { primary: string; secondary: string } };
}

const PlayerCard = ({ player, team }: PlayerCardProps) => {

  const getPositionIcon = (position: Player['position']) => {
    switch (position) {
      case 'Goalkeeper':
        return Shield;
      case 'Defender':
        return Shield;
      case 'Midfielder':
        return Users;
      case 'Forward':
        return Target;
      default:
        return Users;
    }
  };

  const getPositionColor = (position: Player['position']) => {
    switch (position) {
      case 'Goalkeeper':
        return 'text-warning';
      case 'Defender':
        return 'text-primary';
      case 'Midfielder':
        return 'text-accent';
      case 'Forward':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const PositionIcon = getPositionIcon(player.position);
  
  return (
    <Link to={`/player/${player.player_id}`}>
      <div className="player-card cursor-pointer animate-fade-in h-full flex flex-col p-3 md:p-5">
        {/* Player Header */}
        <div className="flex flex-col items-center space-y-2 mb-3 md:mb-4">
          <div className="relative">
            <img
              src={player.profile_photo_url || PlaceholderPlayerImg}
              alt={player.name}
              className="w-24 h-32 md:w-36 md:h-48 object-contain"
              onError={e => {
                const target = e.currentTarget;
                if (target.src !== window.location.origin + PlaceholderPlayerImg) {
                  target.src = PlaceholderPlayerImg;
                }
              }}
            />
            <div 
              className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-md"
              style={{ backgroundColor: team?.colors.primary || '#666' }}
            >
              {player.jersey_number}
            </div>
          </div>
          
          <div className="flex-1 text-center w-full">
            <h3 className="font-bold text-sm md:text-lg text-foreground leading-tight truncate px-1">{player.name}</h3>
            <div className="flex items-center justify-center space-x-1 md:space-x-2 mt-0.5 md:mt-1">
              <PositionIcon className={`h-3 w-3 md:h-4 md:w-4 ${getPositionColor(player.position)}`} />
              <span className="text-[10px] md:text-sm text-muted-foreground">{player.position}</span>
            </div>
            <p className="text-[10px] md:text-sm font-bold mt-0.5" style={{ color: team?.colors.primary }}>
              {team?.short_name}
            </p>
          </div>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-3 gap-1 md:gap-4 mb-2 md:mb-4">
          {player.position === 'Goalkeeper' ? (
            <>
              <div className="text-center">
                <div className="text-sm md:text-xl font-bold text-foreground">{player.appearances}</div>
                <div className="text-[9px] md:text-xs text-muted-foreground">Apps</div>
              </div>
              <div className="text-center">
                <div className="text-sm md:text-xl font-bold text-foreground">{player.saves || 0}</div>
                <div className="text-[9px] md:text-xs text-muted-foreground">Saves</div>
              </div>
              <div className="text-center">
                <div className="text-sm md:text-xl font-bold text-foreground">{player.clean_sheets || 0}</div>
                <div className="text-[9px] md:text-xs text-muted-foreground leading-tight">Clean Sheets</div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="text-sm md:text-xl font-bold text-foreground">{player.appearances}</div>
                <div className="text-[9px] md:text-xs text-muted-foreground">Apps</div>
              </div>
              <div className="text-center">
                <div className="text-sm md:text-xl font-bold text-foreground">{player.goals}</div>
                <div className="text-[9px] md:text-xs text-muted-foreground">Goals</div>
              </div>
              <div className="text-center">
                <div className="text-sm md:text-xl font-bold text-foreground">{player.assists}</div>
                <div className="text-[9px] md:text-xs text-muted-foreground">Assists</div>
              </div>
            </>
          )}
        </div>

        {/* Player Info */}
        <div className="space-y-1 md:space-y-2 text-[10px] md:text-sm mt-auto">
          <div className="flex items-center justify-between border-t border-border/50 pt-2 md:pt-3">
            <span className="text-muted-foreground">Locality:</span>
            <span className="text-foreground font-medium truncate ml-1">{player.locality}</span>
          </div>
          {/* <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Minutes:</span>
            <span className="text-foreground font-medium">{player.minutesPlayed}'</span>
          </div> */}
        </div>

        {/* Cards Record */}
        {/* {(player.yellow_cards > 0 || player.red_cards > 0) && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              {player.yellow_cards > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-4 bg-warning rounded-sm"></div>
                  <span className="text-muted-foreground">{player.yellow_cards}</span>
                </div>
              )}
              {player.red_cards > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-4 bg-destructive rounded-sm"></div>
                  <span className="text-muted-foreground">{player.red_cards}</span>
                </div>
              )}
            </div>
          </div>
        )} */}

        {/* Performance Badge for Top Performers */}
        {/* {(player.goals >= 3 || (player.saves && player.saves >= 10)) && (
          <div className="mt-3 flex items-center justify-center">
            <div className="flex items-center space-x-1 bg-gradient-gold px-2 py-1 rounded-full">
              <Award className="h-3 w-3 text-accent-foreground" />
              <span className="text-xs font-bold text-accent-foreground">
                {player.position === 'Goalkeeper' ? 'Top Keeper' : 'Top Scorer'}
              </span>
            </div>
          </div>
        )} */}
      </div>
    </Link>
  );
};

export default PlayerCard;
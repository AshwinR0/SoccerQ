import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Match } from '@/types';
import { Badge } from '@/components/ui/badge';

interface MatchCardProps {
  match: Match;
  featured?: boolean;
}

const MatchCard = ({ match, featured = false }: MatchCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    return timeString?.slice(0, 5);
  };

  const getStatusBadgeVariant = (status: Match['status']) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Live':
        return 'destructive';
      case 'Upcoming':
        return 'secondary';
      case 'Postponed':
      case 'Cancelled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    // <Link to={`/matches/${match.id}`}>
      // <div className={`${featured ? 'match-card-featured' : 'match-card'} cursor-pointer animate-fade-in h-full`}>
      //   {/* Match Header */}
      //   <div className="flex items-center justify-between mb-4">
      //     <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      //       <Calendar className="h-4 w-4" />
      //       <span>{formatDate(match.match_date)}</span>
      //       {match.status === 'Upcoming' && (
      //         <>
      //           <Clock className="h-4 w-4 ml-2" />
      //           <span>{formatTime(match.match_time)}</span>
      //         </>
      //       )}
      //     </div>
      //     <Badge variant={getStatusBadgeVariant(match.status)}>
      //       {match.status}
      //     </Badge>
      //   </div>

      //   {/* Teams and Score */}
      //   <div className="flex items-center justify-between mb-4 h-16">
      //     {/* Home Team */}
      //     <div className="flex items-center space-x-3 flex-1">
      //       <div 
      //         className="w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-white font-bold text-xs"
      //         style={{ backgroundColor: match.homeTeam.colors.primary }}
      //       >
      //         {match.homeTeam.short_name}
      //       </div>
      //       <div>
      //         <div className="font-semibold text-foreground">{match.homeTeam.name}</div>
      //         <div className="text-sm text-muted-foreground">{match.homeTeam.short_name}</div>
      //       </div>
      //     </div>

      //     {/* Score */}
      //     <div className="px-4">
      //       {match.status === 'Completed' ? (
      //         <div className="text-center">
      //           <div className="text-2xl font-bold text-foreground">
      //             {match.home_score} - {match.away_score}
      //           </div>
      //           <div className="text-xs text-muted-foreground">FT</div>
      //         </div>
      //       ) : match.status === 'Live' ? (
      //         <div className="text-center">
      //           <div className="text-2xl font-bold text-foreground">
      //             {match.home_score} - {match.away_score}
      //           </div>
      //           <div className="text-xs text-destructive animate-pulse">LIVE</div>
      //         </div>
      //       ) : (
      //         <div className="text-center">
      //           <div className="text-lg font-semibold text-muted-foreground">VS</div>
      //         </div>
      //       )}
      //     </div>

      //     {/* Away Team */}
      //     <div className="flex items-center space-x-3 flex-1 justify-end">
      //       <div className="text-right">
      //         <div className="font-semibold text-foreground">{match.awayTeam.name}</div>
      //         <div className="text-sm text-muted-foreground">{match.awayTeam.short_name}</div>
      //       </div>
      //       <div 
      //         className="w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-white font-bold text-xs"
      //         style={{ backgroundColor: match.awayTeam.colors.primary }}
      //       >
      //         {match.awayTeam.short_name}
      //       </div>
      //     </div>
      //   </div>

      //   {/* Match Details */}
      //   <div className="flex items-center justify-between text-sm text-muted-foreground">
      //     <div className="flex items-center space-x-2">
      //       <MapPin className="h-4 w-4" />
      //       <span>{match.venue}</span>
      //     </div>
      //     {match.attendance && (
      //       <div className="flex items-center space-x-2">
      //         <Users className="h-4 w-4" />
      //         <span>{match.attendance.toLocaleString()}</span>
      //       </div>
      //     )}
      //   </div>

      //   {/* Scorers (for completed matches) */}
      //   {match.status === 'Completed' && match.scorers && match.scorers.length > 0 && (
      //     <div className="mt-3 pt-3 border-t border-border">
      //       <div className="text-xs text-muted-foreground mb-1">Scorers:</div>
      //       <div className="space-y-1">
      //         {match.scorers.slice(0, 3).map((scorer, index) => (
      //           <div key={index} className="text-sm">
      //             <span className="font-medium">{scorer.playerName}</span>
      //             <span className="text-muted-foreground ml-1">({scorer.minute}')</span>
      //           </div>
      //         ))}
      //         {match.scorers.length > 3 && (
      //           <div className="text-xs text-muted-foreground">
      //             +{match.scorers.length - 3} more
      //           </div>
      //         )}
      //       </div>
      //     </div>
      //   )}
      // </div>
      <div className={`${featured ? 'match-card-featured' : 'match-card'} cursor-pointer animate-fade-in h-full`}>
  {/* Match Header */}
  <div className="flex items-center justify-between mb-3 flex-wrap text-sm text-muted-foreground">
    <div className="flex items-center space-x-2">
      <Calendar className="h-4 w-4" />
      <span>{formatDate(match.match_date)}</span>
      {match.status === 'Upcoming' && (
        <>
          <Clock className="h-4 w-4 ml-2" />
          <span>{formatTime(match.match_time)}</span>
        </>
      )}
    </div>
    <Badge variant={getStatusBadgeVariant(match.status)}>{match.status}</Badge>
  </div>

  {/* Top row: Home VS Away (inline). Center column stacks VS and score so they align vertically */}
  <div className="flex flex-col items-center gap-3 mb-4">
    <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      {/* Home Team (left) */}
      <div className="flex items-center space-x-2 min-w-0">
        <div
          className="w-9 h-9 max-[480px]:w-8 max-[480px]:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
          style={{ backgroundColor: match.homeTeam.colors.primary }}
        >
          {match.homeTeam.short_name}
        </div>
        <div className="min-w-0">
          <span className="font-semibold text-sm truncate block max-w-[40vw]">{match.homeTeam.name}</span>
        </div>
      </div>

      {/* Center column: VS above the score */}
      <div className="flex flex-col items-center">
        <div className="text-sm font-medium text-muted-foreground">{match.status !== 'Completed' ? 'VS' : ''}</div>
        <div className="text-2xl max-[480px]:text-lg font-bold text-foreground my-1">
          {match.status === 'Completed' || match.status === 'Live'
            ? `${match.home_score ?? 0} - ${match.away_score ?? 0}`
            : ''}
        </div>
        {/* <div className="text-xs text-muted-foreground">
          {match.status === 'Completed' ? 'FT' : match.status === 'Live' ? 'LIVE' : ''}
        </div> */}
      </div>

      {/* Away Team (right) */}
      <div className="flex items-center space-x-2 min-w-0 justify-end">
        <div className="min-w-0 text-right">
          <span className="font-semibold text-sm truncate block max-w-[40vw]">{match.awayTeam.name}</span>
        </div>
        <div
          className="w-9 h-9 max-[480px]:w-8 max-[480px]:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
          style={{ backgroundColor: match.awayTeam.colors.primary }}
        >
          {match.awayTeam.short_name}
        </div>
      </div>
    </div>
  </div>

  {/* Venue + Attendance */}
  <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground flex-wrap gap-y-1">
    <div className="flex items-center space-x-1">
      <MapPin className="h-3.5 w-3.5" />
      <span className="truncate">{match.venue}</span>
    </div>
    {match.attendance && (
      <div className="flex items-center space-x-1">
        <Users className="h-3.5 w-3.5" />
        <span>{match.attendance.toLocaleString()}</span>
      </div>
    )}
  </div>
</div>

    // </Link>
  );
};

export default MatchCard;
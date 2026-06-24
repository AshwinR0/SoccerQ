import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Match, MatchEvent } from '@/types';
import { Badge } from '@/components/ui/badge';

const renderEventIcon = (event: string, side: 'left' | 'right') => {
  const marginClass = side === 'left' ? 'mr-1.5' : 'ml-1.5';
  switch (event) {
    case 'Goal':
      return <span className={`text-[11px] ${marginClass}`} title="Goal">⚽</span>;
    case 'Penalty Goal':
      return <span className={`text-[11px] ${marginClass}`} title="Penalty Goal">⚽ (P)</span>;
    case 'Own Goal':
      return <span className={`text-[11px] text-destructive ${marginClass}`} title="Own Goal">⚽ (OG)</span>;
    case 'Yellow Card':
      return (
        <span
          className={`inline-block w-2.5 h-3.5 bg-yellow-500 rounded-[2px] shadow-sm border border-yellow-600/30 shrink-0 ${side === 'left' ? 'mr-1.5' : 'ml-1.5'}`}
          title="Yellow Card"
        />
      );
    case 'Red Card':
      return (
        <span
          className={`inline-block w-2.5 h-3.5 bg-red-500 rounded-[2px] shadow-sm border border-red-600/30 shrink-0 ${side === 'left' ? 'mr-1.5' : 'ml-1.5'}`}
          title="Red Card"
        />
      );
    case 'Penalty Miss':
      return <span className={`text-[11px] text-muted-foreground ${marginClass}`} title="Penalty Miss">❌ (pen)</span>;
    default:
      return null;
  }
};

const renderHomeEvent = (e: MatchEvent) => {
  const showAssist = e.assist_player?.name && (e.event === 'Goal' || e.event === 'Penalty Goal');
  const hasIcon = ['Goal', 'Penalty Goal', 'Own Goal', 'Yellow Card', 'Red Card', 'Penalty Miss'].includes(e.event);
  return (
    <div key={e.id} className="flex flex-col items-start min-w-0 w-full text-left">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground w-full min-w-0">
        {renderEventIcon(e.event, 'left')}
        <span className="font-medium text-foreground truncate">
          {e.player?.name || 'Unknown'}
        </span>
        <span className="text-[10px] font-semibold text-muted-foreground/80">{e.minute}'</span>
      </div>
      {showAssist && (
        <span className={`text-[10px] text-muted-foreground/80 truncate max-w-full ${hasIcon ? 'pl-[22px]' : 'pl-4'}`}>
          {e.assist_player?.name}
        </span>
      )}
    </div>
  );
};

const renderAwayEvent = (e: MatchEvent) => {
  const showAssist = e.assist_player?.name && (e.event === 'Goal' || e.event === 'Penalty Goal');
  const hasIcon = ['Goal', 'Penalty Goal', 'Own Goal', 'Yellow Card', 'Red Card', 'Penalty Miss'].includes(e.event);
  return (
    <div key={e.id} className="flex flex-col items-end min-w-0 w-full text-right">
      <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground w-full min-w-0">
        <span className="text-[10px] font-semibold text-muted-foreground/80">{e.minute}'</span>
        <span className="font-medium text-foreground truncate">
          {e.player?.name || 'Unknown'}
        </span>
        {renderEventIcon(e.event, 'right')}
      </div>
      {showAssist && (
        <span className={`text-[10px] text-muted-foreground/80 truncate max-w-full ${hasIcon ? 'pr-[22px]' : 'pr-4'}`}>
          {e.assist_player?.name}
        </span>
      )}
    </div>
  );
};

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

  const homeEvents = match.match_events?.filter(e => e.team_id === match.homeTeam.id).sort((a, b) => a.minute - b.minute) || [];
  const awayEvents = match.match_events?.filter(e => e.team_id === match.awayTeam.id).sort((a, b) => a.minute - b.minute) || [];
  const hasEvents = homeEvents.length > 0 || awayEvents.length > 0;

  const displayedHomeEvents = homeEvents.slice(0, 3);
  const displayedAwayEvents = awayEvents.slice(0, 3);
  const extraHomeEvents = homeEvents.length - displayedHomeEvents.length;
  const extraAwayEvents = awayEvents.length - displayedAwayEvents.length;

  return (
    <Link to={`/matches/${match.id}`}>
      <div className={`${featured ? 'match-card-featured' : 'match-card'} cursor-pointer animate-fade-in h-full flex flex-col`}>
        {/* Match Header */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(match.match_date)}</span>
            {match.status === 'Upcoming' && (
              <>
                <Clock className="h-4 w-4" />
                <span>{formatTime(match.match_time)}</span>
              </>
            )}
            {match.stage && (
              <Badge variant="outline" className="uppercase text-[10px] font-semibold">{match.stage}</Badge>
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
              <div className="text-2xl max-[480px]:text-lg font-bold text-foreground my-1 flex flex-col items-center">
                <span>
                  {match.status === 'Completed' || match.status === 'Live'
                    ? `${match.home_score ?? 0} - ${match.away_score ?? 0}`
                    : ''}
                </span>
                {match.home_penalty_score != null && match.away_penalty_score != null && (
                  <span className="text-xs font-semibold text-primary mt-0.5 bg-primary/10 px-2 py-0.5 rounded-full">
                    ({match.home_penalty_score} - {match.away_penalty_score} pens)
                  </span>
                )}
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

        {/* Match Events */}
        {hasEvents && (
          <div className="grid grid-cols-2 gap-6 mb-4 text-xs text-muted-foreground border-t border-border/30 pt-3">
            {/* Home Events */}
            <div className="flex flex-col gap-2 min-w-0">
              {displayedHomeEvents.map(renderHomeEvent)}
              {extraHomeEvents > 0 && (
                <span className="text-[10px] text-muted-foreground/60 pl-[22px] italic">
                  + {extraHomeEvents} more
                </span>
              )}
            </div>

            {/* Away Events */}
            <div className="flex flex-col gap-2 min-w-0">
              {displayedAwayEvents.map(renderAwayEvent)}
              {extraAwayEvents > 0 && (
                <span className="text-[10px] text-muted-foreground/60 pr-[22px] italic">
                  + {extraAwayEvents} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Venue + Attendance */}
        <div className="mt-auto pt-3 flex items-center justify-between text-xs sm:text-sm text-muted-foreground flex-wrap gap-y-1 border-t border-border/10">
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

    </Link>
  );
};

export default MatchCard;
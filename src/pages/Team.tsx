import { useParams, useNavigate } from 'react-router-dom';
import { useTeams, usePlayers } from '@/hooks/useSeasonHooks';
import { Team, Player } from '@/types';
import PlayerCard from '@/components/cards/PlayerCard';
import Loader from '@/components/ui/Loader';

const TeamPage = () => {
  const { team_id } = useParams<{ team_id: string}>();
  const navigate = useNavigate();
  const { data: teams, isLoading: teamsLoading, error: teamsError } = useTeams();
  const { data: players, isLoading: playersLoading, error: playersError } = usePlayers();

  if (teamsLoading || playersLoading) return <Loader />;
  if (teamsError || playersError) return <div>Error loading data.</div>;

  const team = teams?.find((t: Team) => t.id === team_id);
  const teamMembers = players?.filter((p: Player) => p.team_id === team_id);

  if (!team) {
    navigate('/teams');
    return null;
  }

  return (
    <div className="team-page p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <span
          className="text-muted-foreground text-base cursor-pointer hover:text-primary transition"
          onClick={() => navigate('/teams')}
        >
          ← Back to teams
        </span>
      </div>
      <div className="mb-8">
        <h1 className="text-5xl text-center text-gradient-pitch font-extrabold mb-4">{team.name}</h1>
        <h2 className="text-2xl text-center text-muted-foreground mb-6">{team.coach}</h2>
        <div className="flex flex-wrap gap-8 items-center justify-center">
            <div className="flex justify-center items-center min-w-[350px]">
              <div className="bg-card border border-border rounded-2xl shadow-lg p-8 flex flex-col items-center w-full max-w-lg">
                {/* <img src={team.logoUrl} alt={team.name + ' logo'} className="w-28 h-28 object-contain mb-4" /> */}
                {/* <h2 className="text-3xl font-extrabold mb-2 text-center" style={{ color: team.colors?.primary }}>{team.name}</h2> */}
                <div className="w-full flex flex-col gap-2 text-lg">
                  <div className="flex justify-between"><span className="font-semibold text-muted-foreground">Points</span><span className="font-bold text-foreground">{team.points}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-muted-foreground">Wins</span><span className="font-bold text-foreground">{team.wins}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-muted-foreground">Draws</span><span className="font-bold text-foreground">{team.draws}</span></div>
                  <div className="flex justify-between"><span className="font-semibold text-muted-foreground">Losses</span><span className="font-bold text-foreground">{team.losses}</span></div>





                  {/* <div className="flex justify-between"><span className="font-semibold text-muted-foreground">Stadium: </span><span className="font-bold text-foreground">{team.stadium}</span></div> */}
                  {/* <div className="flex justify-between items-center"><span className="font-semibold text-muted-foreground">Colors</span>
                    <span>
                      <span className="font-bold mr-2" style={{ color: team.colors?.primary }}>{team.colors?.primary}</span>
                      <span className="font-bold" style={{ color: team.colors?.secondary }}>{team.colors?.secondary}</span>
                    </span>
                  </div> */}
                </div>
                {team.teamBio && (
                  <div className="mt-4 text-base text-foreground text-center leading-relaxed">{team.teamBio}</div>
                )}
              </div>
            </div>
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-4 text-foreground">Squad</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers?.map((player: Player) => (
          <PlayerCard key={player.id} player={player} team={teams?.find(t => t.id === player.team_id)} />
        ))}
      </div>
    </div>
  );
};

export default TeamPage;

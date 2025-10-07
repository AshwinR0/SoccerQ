import { useParams } from 'react-router-dom';
import { useTeams, usePlayers } from '@/hooks/useSeasonHooks';
import { Team, Player } from '@/types';
import PlayerCard from '@/components/cards/PlayerCard';

const TeamPage = () => {
  const { team_id } = useParams<{ team_id: string}>();
  const { data: teams, isLoading: teamsLoading, error: teamsError } = useTeams();
  const { data: players, isLoading: playersLoading, error: playersError } = usePlayers();

  if (teamsLoading || playersLoading) return <div>Loading...</div>;
  if (teamsError || playersError) return <div>Error loading data.</div>;

  const team = teams?.find((t: Team) => t.id === team_id);
  console.log(teams, team_id)
  const teamMembers = players?.filter((p: Player) => p.team_id === team_id);

  if (!team) return <div>Team not found.</div>;

  return (
    <div className="team-page p-6">
      <h1 className="text-3xl font-bold mb-4" style={{ color: team.colors?.primary }}>{team.name}</h1>
      <div className="mb-6">
        <p><strong>Short Name:</strong> {team.short_name}</p>
        <p><strong>Founded:</strong> {team.founded}</p>
        <p><strong>Coach:</strong> {team.coach}</p>
        <p><strong>Stadium:</strong> {team.stadium}</p>
        <p><strong>Colors:</strong> <span style={{ color: team.colors?.primary }}>{team.colors?.primary}</span>, <span style={{ color: team.colors?.secondary }}>{team.colors?.secondary}</span></p>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Squad</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers?.map((player: Player) => (
            <PlayerCard key={player.id} player={player} team={teams?.find(t => t.id === player.team_id)} />
        ))}
      </div>
    </div>
  );
};

export default TeamPage;

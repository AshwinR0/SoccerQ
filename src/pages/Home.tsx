import MatchCard from "@/components/cards/MatchCard";
import TeamCard from "@/components/cards/TeamCard";
import PlayerCard from "@/components/cards/PlayerCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Trophy, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-stadium.jpg";
import { useMatches } from "@/hooks/useSeasonHooks";
import { useStandings } from "@/hooks/useSeasonHooks";
import { useTopScorers } from "@/hooks/useSeasonHooks";

const Home = () => {
  const { data: matches } = useMatches();
  const { data: standings } = useStandings();
  const { data: topScorers } = useTopScorers();

  const upcomingMatches = matches?.filter(m => m.status === 'Upcoming').slice(0, 3);
  const recentMatches = matches?.filter(m => m.status === 'Completed').slice(0, 2);
  const topTeams = standings?.slice(0, 4);
  const topThreeScorers = topScorers?.slice(0, 3);

  const stats = [
    {
      title: 'Total Matches',
      value: matches?.length,
      icon: Calendar,
      color: 'text-primary'
    },
    {
      title: 'Teams',
      value: topTeams?.length,
      icon: Users,
      color: 'text-accent'
    },
    {
      title: 'Goals Scored',
      value: standings?.reduce((total, team) => total + team.goals_for, 0),
      icon: TrendingUp,
      color: 'text-success'
    },
    {
      title: 'Top Scorer Goals',
      value: topThreeScorers?.[0]?.goals || 0,
      icon: Trophy,
      color: 'text-warning'
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section with Background */}
      <div 
        className="relative min-h-[60vh] flex items-center justify-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Football Tournament
            <span className="block text-accent mt-2">Manager</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Track live matches, team standings, and player statistics in real-time
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/matches">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                View Matches
              </Button>
            </Link>
            <Link to="/standings">
              <Button size="lg" variant="outline" className="border-white hover:bg-white hover:text-primary px-8 py-3">
                League Table
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Quick Stats */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.title} className="match-card text-center">
                <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Matches */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Upcoming Matches</h2>
          <Link to="/matches">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        
        {upcomingMatches?.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingMatches?.map((match, index) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                featured={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="match-card text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming matches scheduled</p>
          </div>
        )}
      </section>

      {/* Recent Results */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Recent Results</h2>
          <Link to="/matches?filter=completed">
            <Button variant="outline" size="sm">
              View All Results
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {recentMatches?.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      {/* League Leaders */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Teams */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">League Table</h2>
            <Link to="/standings">
              <Button variant="outline" size="sm">
                Full Table
              </Button>
            </Link>
          </div>
          
          <div className="match-card">
            <div className="space-y-4">
              {topTeams?.map((standing, index) => (
                <div key={standing?.team?.id} className="flex items-center space-x-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className={`font-bold ${index === 0 ? 'text-gradient-gold' : 'text-muted-foreground'}`}>
                      {standing?.position}
                    </span>
                  </div>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: standing.team.colors.primary }}
                  >
                    {standing.team.short_name}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{standing.team.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">{standing.points}</div>
                    <div className="text-xs text-muted-foreground">pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Scorers */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Top Scorers</h2>
            <Link to="/leaderboards">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="match-card">
            <div className="space-y-4">
              {topThreeScorers?.map((scorer, index) => (
                <div key={scorer.player.id} className="flex items-center space-x-4">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <span className={`font-bold ${index === 0 ? 'text-gradient-gold' : 'text-muted-foreground'}`}>
                      {scorer.rank}
                    </span>
                  </div>
                  <img
                    src={scorer.player.profile_photo_url}
                    alt={scorer.player.name}
                    className="w-12 h-12 object-contain border-border"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{scorer.player.name}</div>
                    <div className="text-sm text-muted-foreground">{scorer?.team?.short_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">{scorer.goals}</div>
                    <div className="text-xs text-muted-foreground">goals</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default Home;